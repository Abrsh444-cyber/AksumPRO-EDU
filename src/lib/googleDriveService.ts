import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import { DriveFile } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider Config with drive, docs, sheets, and gmail scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/documents');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state checker
export const initDriveAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Try to get token from modern session or fallback
        cachedAccessToken = null;
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Start Google sign-in flow
export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No OAuth Access Token active under authorized outcome.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Core Google GSI auth failure:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Log out user
export const logoutFromGoogleDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Retrieve active cached access token
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * GOOGLE DRIVE REST API ENDPOINTS
 */

// List files under active Google Drive profile
export const listDriveFiles = async (
  accessToken: string,
  searchQuery?: string,
  folderId?: string
): Promise<DriveFile[]> => {
  try {
    let q = "trashed = false";
    
    // Default to files that look like notes/backups/checklists or match general search queries
    if (searchQuery) {
      q += ` and (name contains '${searchQuery.replace(/'/g, "\\'")}')`;
    }
    if (folderId) {
      q += ` and '${folderId}' in parents`;
    }

    const fields = 'files(id, name, mimeType, webViewLink, size, createdTime, thumbnailLink, iconLink)';
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=30&orderBy=createdTime%20desc`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google Drive list files API error:', errText);
      throw new Error(`Drive list API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (e) {
    console.error('listDriveFiles error:', e);
    throw e;
  }
};

// Search folder or create if missing to keep files structured
export const findOrCreateDriveFolder = async (
  accessToken: string,
  folderName: string
): Promise<string> => {
  try {
    // 1. Check if folder already exists
    const q = `name = '${folderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`;
    
    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id;
      }
    }

    // 2. Folder does not exist, create it
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };

    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });

    if (!createRes.ok) {
      throw new Error(`Folder creation failed under status code ${createRes.status}`);
    }

    const folderData = await createRes.json();
    return folderData.id;
  } catch (err) {
    console.error('findOrCreateDriveFolder error:', err);
    throw err;
  }
};

// Upload a text/json study backup raw file to user's Google Drive
export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'application/json',
  parentFolderId?: string
): Promise<DriveFile> => {
  try {
    const metadata: any = {
      name: fileName,
      mimeType: mimeType
    };

    if (parentFolderId) {
      metadata.parents = [parentFolderId];
    }

    const boundary = 'aksum_uploader_boundary_marker';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const body = 
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelimiter;

    const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: body
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Drive file upload request failed: ${errorMsg}`);
    }

    const data = await response.json();
    return data as DriveFile;
  } catch (err) {
    console.error('uploadFileToDrive error:', err);
    throw err;
  }
};

// Delete a specified file from Google Drive (needs user confirmation check in UI)
export const deleteFileFromDrive = async (
  accessToken: string,
  fileId: string
): Promise<boolean> => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Delete file API failure details: ${errText}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('deleteFileFromDrive error:', err);
    return false;
  }
};

/**
 * GOOGLE DOCS API INTEGRATION
 */
export const createGoogleDoc = async (
  accessToken: string,
  title: string,
  content: string
): Promise<{ id: string; url: string }> => {
  try {
    // 1. Create an empty Google Doc
    const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Google Docs creation failed: ${errorText}`);
    }

    const doc = await createRes.json();
    const documentId = doc.documentId;

    // 2. Load it with the requested academic document text
    const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              text: content,
              location: { index: 1 },
            },
          },
        ],
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      throw new Error(`Google Docs batch update failed: ${errorText}`);
    }

    return {
      id: documentId,
      url: `https://docs.google.com/document/d/${documentId}/edit`,
    };
  } catch (err) {
    console.error('createGoogleDoc error:', err);
    throw err;
  }
};

/**
 * GOOGLE SHEETS API INTEGRATION
 */
export const createGoogleSheet = async (
  accessToken: string,
  title: string,
  values: string[][]
): Promise<{ id: string; url: string }> => {
  try {
    // 1. Create a raw Google Sheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { title },
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Google Sheets creation failed: ${errorText}`);
    }

    const sheet = await createRes.json();
    const spreadsheetId = sheet.spreadsheetId;
    const sheetName = sheet.sheets[0]?.properties?.title || 'Sheet1';

    // 2. Populate cells with our structured study table values
    const range = `${sheetName}!A1`;
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;

    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values,
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      throw new Error(`Google Sheets cells write failed: ${errorText}`);
    }

    return {
      id: spreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    };
  } catch (err) {
    console.error('createGoogleSheet error:', err);
    throw err;
  }
};

/**
 * GMAIL API INTEGRATION
 */
export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<{ id: string }> => {
  try {
    // Construct standard RFC822 email format
    const emailHeaderLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      body
    ];

    const rawEmail = emailHeaderLines.join('\r\n');

    // Safe base64url encoding
    const base64UrlSafe = btoa(unescape(encodeURIComponent(rawEmail)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: base64UrlSafe,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail message send failed: ${errorText}`);
    }

    const result = await response.json();
    return { id: result.id };
  } catch (err) {
    console.error('sendGmailMessage error:', err);
    throw err;
  }
};

