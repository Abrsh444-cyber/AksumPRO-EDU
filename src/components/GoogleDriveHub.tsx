import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Cloud, 
  Folder, 
  FileText, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  Database, 
  Search, 
  RefreshCw, 
  AlertTriangle,
  Upload,
  Mail,
  FileSpreadsheet,
  BookOpen,
  Send,
  CheckCircle2
} from 'lucide-react';
import { DriveFile, StudentInfo } from '../types';
import { 
  initDriveAuth, 
  signInWithGoogleDrive, 
  logoutFromGoogleDrive, 
  listDriveFiles, 
  findOrCreateDriveFolder, 
  uploadFileToDrive, 
  deleteFileFromDrive,
  createGoogleDoc,
  createGoogleSheet,
  sendGmailMessage
} from '../lib/googleDriveService';

interface GoogleDriveHubProps {
  lang: 'amh' | 'eng';
  studentInfo: StudentInfo;
  completedMinutes: number;
  savedShortNotes: any[];
  showToast: (msg: string) => void;
  onBack: () => void;
}

export default function GoogleDriveHub({
  lang,
  studentInfo,
  completedMinutes,
  savedShortNotes,
  showToast,
  onBack
}: GoogleDriveHubProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isBackupInProgress, setIsBackupInProgress] = useState<boolean>(false);

  // Google Docs state
  const [isCreatingDoc, setIsCreatingDoc] = useState<boolean>(false);
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);

  // Google Sheets state
  const [isCreatingSheet, setIsCreatingSheet] = useState<boolean>(false);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);

  // Gmail State
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);
  
  // Confirmation state for deleting Google Drive files safely
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Pre-fill email body dynamically with student analytics and saved notes
  useEffect(() => {
    if (studentInfo) {
      setEmailRecipient(user?.email || 'parent-or-teacher@gmail.com');
      setEmailSubject(lang === 'amh' ? `🏛️ የ አክሱም VIP አካዳሚ የጥናት ሪፖርት - ${studentInfo.name}` : `🏛️ Aksum VIP Academy Study Report - ${studentInfo.name}`);
      
      const formattedNotes = savedShortNotes && savedShortNotes.length > 0 
        ? savedShortNotes.map((n, i) => `[Note ${i+1}] Subject: ${n.subject}\nTitle: ${n.title}\nContent:\n${n.content}`).join('\n\n')
        : '(No saved short notes yet)';

      const bodyText = lang === 'amh' ? 
`ሰላም፣

ይህ የ ${studentInfo.name} የጥናት ሪፖርት ነው። ከ አክሱም VIP አካዳሚ የተላከ።

የጥናት መረጃዎች፡-
• የአሁኑ የጥናት ክፍል ስትሪም፡ ${studentInfo.fieldStream}
• የተቀመጡ የጥናት ደቂቃዎች፡ ${completedMinutes} ደቂቃዎች
• የታለመው ዩኒቨርሲቲ፡ ${studentInfo.targetUniversity || 'ያልተመረጠ'}

የተቀመጡ የእንቁ የጥናት ማስታወሻዎች እና ቀመሮች ስብስብ፡-
${formattedNotes}

የማትሪክ ፈተናውን በላቀ ውጤት ለማለፍ ጠንክረን እንማራለን!
ከሠላምታ ጋር፣
የአክሱም VIP አካዳሚ ቡድን` :
`Hello,

Here is the personalized ESSLCE study report for candidate: ${studentInfo.name}.

Study Analytics:
• Academic Stream: ${studentInfo.fieldStream}
• Focused Study Minutes: ${completedMinutes} mins
• Target University: ${studentInfo.targetUniversity || 'Not specified'}

Saved Gold-Yield Short Notes & Equation Cheat Sheets (${savedShortNotes?.length || 0} Saved):
--------------------------------------------------
${formattedNotes}

Let's keep up the consistency streak to crush the Ethiopian Matric Exam!
Best Regards,
The Aksum VIP Academy Team`;

      setEmailBody(bodyText);
    }
  }, [studentInfo, savedShortNotes, completedMinutes, lang, user]);

  // Initialize and check current Auth state
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsLoading(false);
        loadFiles(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch file listings
  const loadFiles = async (accessToken: string, query?: string) => {
    setIsSyncing(true);
    try {
      const driveFiles = await listDriveFiles(accessToken, query);
      setFiles(driveFiles);
    } catch (err) {
      console.error(err);
      showToast(lang === 'amh' ? '⚠️ የማህደር ፋይሎችን መጫን አልተቻለም!' : '⚠️ Failed to fetch Drive listings!');
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Login click handler
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogleDrive();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        showToast(lang === 'amh' ? '🔐 ከጉግል አካውንትዎ ጋር በተሳካ ሁኔታ ተገናኝቷል!' : '🔐 Connected to Google Drive securely!');
        loadFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      showToast(lang === 'amh' ? '❌ የጉግል መግቢያው አልተሳካም!' : '❌ GSI authentication cancelled or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout click handler
  const handleLogout = async () => {
    try {
      await logoutFromGoogleDrive();
      setUser(null);
      setToken(null);
      setFiles([]);
      showToast(lang === 'amh' ? '🔓 ከጉግል አካውንትዎ በተሳካ ሁኔታ ወጥተዋል!' : '🔓 Safely disconnected from Google Drive.');
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger search with query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      loadFiles(token, searchQuery);
    }
  };

  // Backup Student Academics Info to Drive
  const handleBackupAcademics = async () => {
    if (!token) return;
    setIsBackupInProgress(true);
    try {
      // 1. Find or Create dedicated App folder
      const folderId = await findOrCreateDriveFolder(token, 'Aksum VIP Academy Backups');
      
      // 2. Build Academic JSON content
      const payload = {
        student: {
          name: studentInfo.name,
          phone: studentInfo.phone,
          school: studentInfo.school,
          stream: studentInfo.fieldStream,
          targetUni: studentInfo.targetUniversity,
          preferredLanguage: studentInfo.preferredLanguage
        },
        progress: {
          focusedMinutes: completedMinutes,
          backupTimestamp: new Date().toISOString(),
          appBuild: 'v1.2.0-Official'
        }
      };

      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).replace(/ /g, '_');
      
      const fileName = `Aksum_Backup_${studentInfo.name.replace(/ /g, '_')}_${dateStr}.json`;
      
      // 3. Upload content
      await uploadFileToDrive(token, fileName, JSON.stringify(payload, null, 2), 'application/json', folderId);
      
      showToast(lang === 'amh' ? '🚀 የጥናት መረጃዎ በጉግል ድራይቭ ላይ ተቀምጧል!' : '🚀 Academic record backed up to Google Drive successfully!');
      
      // 4. Reload
      loadFiles(token);
    } catch (err) {
      console.error(err);
      showToast(lang === 'amh' ? '❌ የጥናት መረጃውን መጫን አልተቻለም!' : '❌ Google Drive uploading pipeline failed.');
    } finally {
      setIsBackupInProgress(false);
    }
  };

  // Simulated syllabus check sheet upload
  const handleCreateMockChecklist = async () => {
    if (!token) return;
    setIsBackupInProgress(true);
    try {
      const folderId = await findOrCreateDriveFolder(token, 'Aksum VIP Academy Backups');
      const content = `🎓 AKSUM VIP PREPARATORY ACADEMY
==================================================
MATRIC CANDIDATE PORTFOLIO
Candidate: ${studentInfo.name}
Academic Stream: ${studentInfo.fieldStream}
Target Destination: ${studentInfo.targetUniversity}
Focused Learning Effort: ${completedMinutes} total minutes

SUBJECT WISE MANDATORY SYLLABUS SYNC CHECKLIST:
[✓] Mathematics: Relations, Functions & Matrix algebra
[✓] Physics: Kinematics, Newtonian Mechanics & Electromagnetism
[✓] Chemistry: Molecular Structure, Thermodynamics & Organic
[✓] English: Clause Structure, Vocabulary & Concordance
[ ] Biology/History: Specialized syllabus revision check

* Generated via secure Google Drive API integration.
* Keep pushing boundaries to achieve 600+ on the Ethiopian Matric Exam!`;

      const fileName = `Study_Checklist_${studentInfo.name.replace(/ /g, '_')}.txt`;
      await uploadFileToDrive(token, fileName, content, 'text/plain', folderId);
      showToast(lang === 'amh' ? '📝 የጥናት ፎርም ዝግጅት በድራይቭዎ ላይ ተቀምጧል!' : '📝 Study checklist exported to Google Drive successfully!');
      loadFiles(token);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBackupInProgress(false);
    }
  };

  // Export Saved Notes to a high-fidelity Google Doc
  const handleExportToDocs = async () => {
    if (!token) return;
    
    // Explicit User Confirmation check before mutative API call (Mandated Safeguard!)
    const confirmName = `Aksum Study Notes - ${studentInfo.name}`;
    const confirmed = window.confirm(
      lang === 'amh' 
        ? `"${confirmName}" የተባለ አዲስ የጉግል ዶክመንት (Google Doc) መፍጠር ይፈልጋሉ?`
        : `Are you sure you want to create a new Google Doc named "${confirmName}" containing your ${savedShortNotes.length} saved short notes?`
    );
    if (!confirmed) return;

    setIsCreatingDoc(true);
    setCreatedDocUrl(null);
    try {
      // Formulate document content nicely
      const title = `Aksum VIP Academy Study Portfolio - ${studentInfo.name}`;
      let content = `🏛️ AKSUM VIP PREPARATORY ACADEMY\n`;
      content += `==============================================\n`;
      content += `ESSLCE MATRIC PREPARATION STUDY PORTFOLIO\n\n`;
      content += `Candidate: ${studentInfo.name}\n`;
      content += `Field Stream: ${studentInfo.fieldStream}\n`;
      content += `Target University: ${studentInfo.targetUniversity || 'AAU'}\n`;
      content += `Total Logged Minutes: ${completedMinutes} minutes\n`;
      content += `Document Generation Timestamp: ${new Date().toLocaleString()}\n\n`;
      content += `----------------------------------------------\n`;
      content += `SAVED HIGH-YIELD BRIEF NOTES & CHEAT SHEETS\n`;
      content += `----------------------------------------------\n\n`;

      if (savedShortNotes && savedShortNotes.length > 0) {
        savedShortNotes.forEach((note, index) => {
          content += `📌 [NOTE ${index + 1}] SUBJECT: ${note.subject.toUpperCase()}\n`;
          content += `Title: ${note.title}\n`;
          content += `Category: ${note.category?.toUpperCase() || 'GENERAL'}\n`;
          content += `Saved on: ${note.time}\n`;
          content += `Content:\n${note.content}\n\n`;
          content += `----------------------------------------------\n\n`;
        });
      } else {
        content += `(No saved short notes are cached in your profile yet. Save notes in the GPT chatbot tab first!)\n`;
      }

      content += `\n* Developed and exported with precision via Aksum VIP Academy Google Workspace integration.`;

      const result = await createGoogleDoc(token, title, content);
      setCreatedDocUrl(result.url);
      showToast(lang === 'amh' ? '📄 የጉግል ዶክመንት በተሳካ ሁኔታ ተፈጥሯል!' : '📄 Google Document created and drafted successfully!');
      loadFiles(token);
    } catch (err: any) {
      console.error(err);
      showToast(lang === 'amh' ? '❌ ጉግል ዶክመንት መፍጠር አልተሳካም!' : '❌ Failed to create Google Doc.');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Export entire student performance checklist and saved notes to Google Sheets
  const handleExportToSheets = async () => {
    if (!token) return;

    const confirmName = `Aksum Study Sync Tracker - ${studentInfo.name}`;
    const confirmed = window.confirm(
      lang === 'amh'
        ? `"${confirmName}" የተባለ አዲስ የጉግል ሸረሪት ሰሌዳ (Google Sheet) በእርስዎ አካውንት ላይ መፍጠር ይፈልጋሉ?`
        : `Are you sure you want to create a new Google Sheet named "${confirmName}" to synchronize and track your active academic record?`
    );
    if (!confirmed) return;

    setIsCreatingSheet(true);
    setCreatedSheetUrl(null);
    try {
      const title = `Aksum Study Sync Tracker - ${studentInfo.name}`;

      // Design spreadsheet row matrix columns
      const headerRow1 = ['🎓 AKSUM VIP PREPARATORY ACADEMY - STUDENT METRICS TRACKER'];
      const blankRow = [''];
      
      const infoHeaders = ['Student Name', 'Field Stream', 'Study Minutes Completed', 'Target University', 'Last Export Time'];
      const infoValues = [
        studentInfo.name, 
        studentInfo.fieldStream, 
        completedMinutes.toString(), 
        studentInfo.targetUniversity || 'Not selected', 
        new Date().toLocaleString()
      ];

      const notesHeaders = ['#', 'Subject', 'Category', 'Title', 'Saved Time', 'Note Content / Equation'];
      
      const valuesMatrix: string[][] = [
        headerRow1,
        blankRow,
        infoHeaders,
        infoValues,
        blankRow,
        ['📚 SAVED HIGHLIGHT NOTES LOG'],
        notesHeaders
      ];

      if (savedShortNotes && savedShortNotes.length > 0) {
        savedShortNotes.forEach((note, index) => {
          valuesMatrix.push([
            (index + 1).toString(),
            note.subject || 'General',
            note.category || 'Highlight',
            note.title || 'Untitled',
            note.time || 'N/A',
            note.content || ''
          ]);
        });
      } else {
        valuesMatrix.push(['-', '(No saved notes found)', '-', '-', '-', '-']);
      }

      const result = await createGoogleSheet(token, title, valuesMatrix);
      setCreatedSheetUrl(result.url);
      showToast(lang === 'amh' ? '📊 የጉግል ሺት በላቀ መልኩ ተዘጋጅቷል!' : '📊 Google Sheet structured and generated successfully!');
      loadFiles(token);
    } catch (err: any) {
      console.error(err);
      showToast(lang === 'amh' ? '❌ ጉግል ሺት መፍጠር አልተሳካም!' : '❌ Failed to generate Google Sheet.');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Send the drafted email report using live Gmail API
  const handleSendGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!emailRecipient.trim()) {
      showToast(lang === 'amh' ? '⚠️ እባክዎ የኢሜይል አድራሻ ያስገቡ' : '⚠️ Please enter a valid recipient email.');
      return;
    }

    // Confirmation dialog before sending email (Mandated security rule!)
    const confirmed = window.confirm(
      lang === 'amh'
        ? `ኢሜይሉን ወደ "${emailRecipient}" መላክ ይፈልጋሉ?`
        : `Send this academic study report email to "${emailRecipient}" now?`
    );
    if (!confirmed) return;

    setIsSendingEmail(true);
    setEmailSentSuccess(false);
    try {
      await sendGmailMessage(token, emailRecipient, emailSubject, emailBody);
      setEmailSentSuccess(true);
      showToast(lang === 'amh' ? '✉️ የጥናት ዘገባው በኢሜይልዎ ተልኳል!' : '✉️ Study progress report email sent via Gmail successfully!');
    } catch (err: any) {
      console.error(err);
      showToast(lang === 'amh' ? '❌ ኢሜይል መላክ አልተሳካም!' : '❌ Failed to send email via Gmail.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Trigger Delete confirmation dialog
  const confirmDeleteFile = (file: DriveFile) => {
    setFileToDelete(file);
  };

  // Safe mutative deletion handler (adheres to Guidelines step-by-step confirmation dialog)
  const handleDeleteExecute = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await deleteFileFromDrive(token, fileToDelete.id);
      if (ok) {
        showToast(lang === 'amh' ? '🗑️ ፋይሉ ከጉግል ድራይቭ ላይ ተሰርዟል!' : '🗑️ File removed from Google Drive.');
        setFiles(files.filter(f => f.id !== fileToDelete.id));
      } else {
        showToast(lang === 'amh' ? '❌ ፋይሉን መሰረዝ አልተቻለም!' : '❌ Drive API rejected resource deletion.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 text-white">
      
      {/* Header bar and back control */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="h-10 px-4 rounded-xl bg-vip-slate/50 text-vip-gold text-xs font-bold flex items-center gap-1.5 border border-[#cca43b]/15 active:scale-95 transition cursor-pointer min-h-[40px]"
        >
          ← {lang === 'amh' ? 'ወደ ዋነኛው ዳሽቦርድ ይመለሱ' : 'Back to Home'}
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="h-10 px-3.5 rounded-xl bg-red-950/20 text-red-400 text-xs font-bold flex items-center gap-1.5 border border-red-900/40 active:scale-95 transition cursor-pointer min-h-[40px]"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'amh' ? 'ውጣ' : 'Disconnect'}</span>
          </button>
        )}
      </div>

      {/* Hero Header panel */}
      <div className="p-6 md:p-8 rounded-3xl border border-vip-gold/15 bg-gradient-to-br from-[#0c081c] via-[#0a0f19] to-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-vip-gold/5 rounded-full filter blur-[80px]" />
        
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vip-gold/10 border border-vip-gold/25 text-[#cca43b] text-[10px] font-black uppercase tracking-wider">
            <Cloud className="w-3.5 h-3.5 animate-bounce" />
            <span>Google Drive Workspace Integration</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black font-display text-gradient-gold">
            {lang === 'amh' ? '📁 የጉግል ድራይቭ ማከማቻ ሞጁል' : '📁 GOOGLE DRIVE STUDY VAULT'}
          </h2>

          <p className="text-xs text-[#cbd5e1] leading-relaxed max-w-2xl">
            {lang === 'amh'
              ? 'የዕለት ከዕለት የጥናት እድገትዎን እና የፈተና ውጤት ምስክር ወረቀቶችን በቀጥታ ደህንነቱ በተጠበቀ የጉግል ድራይቭ ማህደርዎ ላይ ያስቀምጡ! የጥናት ሰሌዳዎችን ከተለያዩ መሳሪያዎች ሆነው መክፈት ይችላሉ።'
              : 'Backup your overall academic metrics, study logs, and score performance lists directly into your Google Drive personal cloud storage. Keep your documents saved and accessible on the go.'}
          </p>
        </div>
      </div>

      {/* Main State Condition Block */}
      {!user ? (
        /* ================= AUTHENTICATION BANNER RENDERING ================= */
        <div className="p-8 rounded-2xl border border-slate-800 bg-[#0b0f19] flex flex-col items-center justify-center text-center space-y-5 py-12 animate-fade-in shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-vip-gold/10 border border-vip-gold/20 flex items-center justify-center text-3xl">
            ☁️
          </div>
          
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-vip-gold">
              {lang === 'amh' ? 'የጉግል አካውንትዎን ያገናኙ' : 'Connect Personal Cloud Sync'}
            </h3>
            <p className="text-xs text-[#a0aec0] leading-relaxed">
              {lang === 'amh' 
                ? 'በራስዎ የግል ጉግል ማህደር ላይ የጥናት መረጃን ለመመዝገብ እባክዎ መጀመሪያ ከጉግል አካውንትዎ ጋር ይገናኙ' 
                : 'To authorize the application to create checklists and synchronize backups, seamlessly log in with Google to query cloud files safely with user permission.'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-vip-gold font-bold">
              <div className="w-4 h-4 border-2 border-t-transparent border-vip-gold rounded-full animate-spin" />
              <span>Authenticating connection...</span>
            </div>
          ) : (
            /* OFFICIAL DESIGN-COMPLIANT MATERIAL SIGN IN WITH GOOGLE BUTTON (Requirement guidelines rule) */
            <button 
              onClick={handleLogin}
              className="px-6 h-12 flex items-center justify-center gap-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-slate-100 active:scale-95 transition shadow-2xl cursor-pointer min-h-[48px] duration-200 border border-slate-200"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0 block">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span>{lang === 'amh' ? 'በጉግል መለያ ይግቡ' : 'Sign In With Google'}</span>
            </button>
          )}
        </div>
      ) : (
        /* ================= HIGH-FIDELITY ACTIVE DRIVE CONTROLS ================= */
        <div className="space-y-6 animate-fade-in">
          
          {/* User profile linked subscriber layout */}
          <div className="p-4 rounded-2xl border border-[#cca43b]/20 bg-vip-slate/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img referrerPolicy="no-referrer" src={user.photoURL} alt={user.displayName || 'Google Profile'} className="w-12 h-12 rounded-full border-2 border-vip-gold shadow" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-vip-gold/10 border border-vip-gold/30 flex items-center justify-center text-lg text-vip-gold">
                  👤
                </div>
              )}
              <div className="leading-snug text-left">
                <span className="text-[10px] text-vip-gold uppercase tracking-wider font-extrabold block">Authorized Active Sync</span>
                <strong className="text-sm block">{user.displayName || 'Subscriber Profile'}</strong>
                <span className="text-[11px] text-slate-400 block">{user.email}</span>
              </div>
            </div>

            {/* Micro stats telemetry */}
            <div className="text-right sm:border-l border-slate-800 sm:pl-4 space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Sovereign Cloud Store</span>
              <p className="text-xs text-[#06b6d4] font-mono leading-none font-bold">Drive Sync Ready</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
                <span>Authorized</span>
              </div>
            </div>
          </div>

          {/* Quick Academic Actions & Upload Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left side: Standard Drive Backups & Syllabus */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0f19] space-y-4 text-left">
              <p className="text-[10px] uppercase font-bold text-gradient-gold flex items-center gap-1.5 tracking-wider">
                <Database className="w-4 h-4 text-vip-gold" />
                {lang === 'amh' ? 'የጥናት ማህደር ማስገቢያዎች' : '🚀 GOOGLE DRIVE STUDY VAULT'}
              </p>

              <div className="space-y-3">
                {/* Back Up Academic Progress Card */}
                <div className="p-4 rounded-xl border border-slate-800/40 bg-[#06101e]/20 space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                      <span className="text-sm">📥</span>
                      {lang === 'amh' ? 'የጥናት እድገት ሰነድ ፍጠር' : 'Backup Academic Record (JSON)'}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'amh' 
                        ? 'የአሁኑን የጥናት ደቂቃዎችን፣ የትምህርት መስክና ዝርዝሮችን ወደ "Aksum VIP Academy Backups" ፎልደር በJSON ሰነድነት ያስቀምጣል።' 
                        : 'Creates a custom study profile JSON detailing focused study logs, exam summaries, and selected targets directly in a secure subfolder.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isBackupInProgress}
                    onClick={handleBackupAcademics}
                    className="w-full h-10 rounded-xl text-xs font-extrabold text-black bg-[#cca43b] hover:bg-yellow-500 shadow-md active:scale-95 transition min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-black" />
                    <span>{isBackupInProgress ? 'Creating backup...' : (lang === 'amh' ? 'አሁን ድጋፍ ፍጠር (Save JSON)' : 'Backup Progress JSON')}</span>
                  </button>
                </div>

                {/* Create PDF Study Notes Checklist */}
                <div className="p-4 rounded-xl border border-slate-800/40 bg-[#06101e]/20 space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                      <span className="text-sm">📝</span>
                      {lang === 'amh' ? 'የጥናት ማረጋገጫ ፎርም አውጣ' : 'Export Study Syllabus Sheet (TXT)'}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'amh' 
                        ? 'የማትሪክ ፈተና የሚዘጋጁበትን የአርዕስቶች ማረጋገጫ ዝርዝር ሰነድ (.TXT) በጉግል ድራይቭዎ ላይ ያትማል።' 
                        : 'Generates a ready-to-study outline checklist for the major National Matric subjects under your streamline to review off cloud.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isBackupInProgress}
                    onClick={handleCreateMockChecklist}
                    className="w-full h-10 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/40 border border-slate-700/60 hover:bg-slate-850 min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                  >
                    <FileText className="w-4 h-4 text-[#cca43b]" />
                    <span>{isBackupInProgress ? 'Exporting...' : (lang === 'amh' ? 'የጥናት ማስተዋሻ አስቀምጥ (Text)' : 'Export Syllabus Text')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Specialized Workspace Apps (Docs & Sheets Integration) */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0f19] space-y-4 text-left">
              <p className="text-[10px] uppercase font-bold text-gradient-gold flex items-center gap-1.5 tracking-wider">
                <Cloud className="w-4 h-4 text-[#cca43b]" />
                {lang === 'amh' ? 'ጉግል ወርክስፔስ (Docs, Sheets)' : '💼 GOOGLE WORKSPACE OFFICE INTEGRATION'}
              </p>

              <div className="space-y-3">
                {/* Google Docs Note Exporter */}
                <div className="p-4 rounded-xl border border-slate-800/40 bg-[#06101e]/20 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                        <span className="text-sm">📄</span>
                        {lang === 'amh' ? 'ማስታወሻዎችን ወደ Docs ላክ' : 'Export Notes to Google Docs'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-blue-950/40 text-blue-400 border border-blue-900/40 text-[8px] font-bold uppercase shrink-0">
                        Docs API
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'amh'
                        ? `በእርስዎ የጥናት ደብተር ውስጥ የሚገኙትን ${savedShortNotes.length} ጠቃሚ ማጠቃለያዎች በቀጥታ ወደ አዲስ Google Doc ይልካል።`
                        : `Instantly drafts and publishes your ${savedShortNotes.length} saved study notes and equations as a formatted, printable Google Doc.`}
                    </p>
                  </div>

                  {createdDocUrl ? (
                    <div className="p-2 px-3 rounded-lg bg-blue-950/20 border border-blue-900/40 flex items-center justify-between gap-1.5 animate-fade-in text-left">
                      <span className="text-[10px] text-blue-300 font-bold truncate flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {lang === 'amh' ? 'ሰነድ ተዘጋጅቷል!' : 'Google Doc Published!'}
                      </span>
                      <a
                        href={createdDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 px-2.5 rounded-lg text-[10px] text-[#cca43b] border border-[#cca43b]/40 hover:bg-slate-800 font-bold flex items-center gap-1 transition"
                      >
                        <span>Open Doc</span>
                        <ExternalLink className="w-3 h-3 text-[#cca43b]" />
                      </a>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isCreatingDoc || savedShortNotes.length === 0}
                      onClick={handleExportToDocs}
                      className="w-full h-10 rounded-xl text-xs font-extrabold text-blue-400 bg-blue-950/25 border border-blue-900/45 hover:bg-blue-950/35 shadow-md active:scale-95 transition min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>{isCreatingDoc ? 'Drafting Doc in progress...' : (savedShortNotes.length === 0 ? (lang === 'amh' ? 'ባዶ ደብተር (ማስታወሻዎችን አስቀምጥ)' : 'Notebook Empty (Save Notes)') : (lang === 'amh' ? 'ወደ Google Doc ፍጠር' : 'Publish Notes as Google Doc'))}</span>
                    </button>
                  )}
                </div>

                {/* Google Sheets Study Progress Logger */}
                <div className="p-4 rounded-xl border border-slate-800/40 bg-[#06101e]/20 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                        <span className="text-sm">📊</span>
                        {lang === 'amh' ? 'እድገት መከታተያ ሸረሪት ሰሌዳ' : 'Syllabus Study Metric Sheet'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 text-[8px] font-bold uppercase shrink-0">
                        Sheets API
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'amh'
                        ? 'የተማሪ መግለጫ መለኪያዎችዎን፣ ያጠኑበት ደቂቃ እና ማጠቃለያዎችን የያዘ የተስተካከለ የጉግል ሸረሪት ሰሌዳ ያዘጋጃል።'
                        : 'Structures a Google Sheet tracking dashboard of your candidate metrics, focus hours, and study logs to review in spreadsheet.'}
                    </p>
                  </div>

                  {createdSheetUrl ? (
                    <div className="p-2 px-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between gap-1.5 animate-fade-in text-left">
                      <span className="text-[10px] text-emerald-300 font-bold truncate flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {lang === 'amh' ? 'ሸረሪት ሰሌዳ ተዘጋጅቷል!' : 'Google Sheet Structured!'}
                      </span>
                      <a
                        href={createdSheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 px-2.5 rounded-lg text-[10px] text-[#cca43b] border border-[#cca43b]/40 hover:bg-slate-800 font-bold flex items-center gap-1 transition"
                      >
                        <span>Open Sheet</span>
                        <ExternalLink className="w-3 h-3 text-[#cca43b]" />
                      </a>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isCreatingSheet}
                      onClick={handleExportToSheets}
                      className="w-full h-10 rounded-xl text-xs font-extrabold text-emerald-400 bg-emerald-950/25 border border-emerald-900/45 hover:bg-emerald-950/35 shadow-md active:scale-95 transition min-h-[40px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>{isCreatingSheet ? 'Compiling Sheet cells...' : (lang === 'amh' ? 'የጉግል ሺት እድገት መከታተያ ፍጠር' : 'Generate Progress Tracker Sheet')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* New row: Gmail Smart Study Report dispatch console */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0f19] space-y-4 text-left">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-gradient-gold flex items-center gap-1.5 tracking-wider">
                <Mail className="w-4 h-4 text-[#cca43b]" />
                {lang === 'amh' ? 'የጂሜይል ዘገባ መላኪያ ሰሌዳ' : '✉️ SMART GMAIL REPORT & SHARING DESK'}
              </p>
              <span className="px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-400 border border-rose-900/40 text-[8px] font-bold uppercase shrink-0">
                Gmail API
              </span>
            </div>

            <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed">
              {lang === 'amh' 
                ? 'ስማርት የጥናት ማጠቃለያዎችን ፣ ማትሪክን ቀመሮችና የቀናትን ስልቶችን በቀጥታ ከእርስዎ እውነተኛ የጉግል መለያ ወደ ወላጆችዎ፣ አስተማሪዎ እንዲሁም ለራስዎ ይላኩ።'
                : 'Directly dispatch your ESSLCE candidate metrics, hourly breakdowns, and a detailed cheat sheet log of your saved short notes to any recipient utilizing Gmail with permission.'}
            </p>

            <form onSubmit={handleSendGmail} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-1 space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-left">
                    {lang === 'amh' ? 'ተቀባይ ኢሜይል' : 'Recipient Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example-parent@gmail.com"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-black/40 text-xs text-white outline-none focus:border-vip-gold transition"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-left">
                    {lang === 'amh' ? 'የኢሜይል አርዕስት' : 'Subject of Report'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Study Report Summary"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-800 bg-black/40 text-xs text-zinc-350 outline-none focus:border-vip-gold transition truncate"
                  />
                </div>

                {emailSentSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-center space-y-1.5 animate-fade-in">
                    <span className="text-xl">🎉</span>
                    <strong className="block text-[11px] text-emerald-400 uppercase font-black tracking-normal">
                      {lang === 'amh' ? 'መልእክቱ በተሳካ ሁኔታ ተልኳል!' : 'Email Dispatched Successfully!'}
                    </strong>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {lang === 'amh' ? 'ኢሜይሉ በእርስዎ መለያ በኩል ተልኳል። ወጥቶ ማየት ይችላሉ።' : 'The email was sent securely on your behalf.'}
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="w-full h-11 rounded-xl text-xs font-black text-black bg-gradient-to-r from-vip-gold to-yellow-600 hover:brightness-110 shadow-lg active:scale-95 transition min-h-[44px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-black" />
                    <span>{isSendingEmail ? (lang === 'amh' ? 'በመላክ ላይ...' : 'Sending Email...') : (lang === 'amh' ? 'አሁን ዘጋባ ላክ (Gmail)' : 'Send Study Digest Email')}</span>
                  </button>
                )}
              </div>

              <div className="md:col-span-2 space-y-1 text-left">
                <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-left">
                  {lang === 'amh' ? 'የሪፖርቱ ይዘት' : 'Email Body (Auto-Drafted Log Preview)'}
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-xl border border-slate-800 bg-black/50 text-xs text-slate-300 font-mono outline-none focus:border-vip-gold transition leading-relaxed resize-none scrollbar-thin"
                />
              </div>
            </form>
          </div>

          {/* Drive file explorer card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0f19] space-y-4">
            
            {/* Toolbar search and actions list */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
              <h3 className="text-xs font-black text-gradient-gold uppercase tracking-wider flex items-center gap-2">
                📂 {lang === 'amh' ? 'የቁልፍ ድራይቭ ሰነዶችህ' : 'PERSONAL CLOUD FILE REALTIME VIEWER'}
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[9px] text-[#cca43b] lowercase">{files.length} found</span>
              </h3>
              
              <button 
                onClick={() => token && loadFiles(token)}
                disabled={isSyncing}
                className="self-end sm:self-auto h-9 px-3 rounded-lg bg-vip-slate/40 border border-[#cca43b]/10 text-xs text-vip-gold hover:text-white flex items-center gap-1.5 hover:border-vip-gold/30 transition cursor-pointer min-h-[36px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-vip-gold ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{lang === 'amh' ? 'አድስ' : 'Sync Stream'}</span>
              </button>
            </div>

            {/* Simulated Search bar implementation client side query filter */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder={lang === 'amh' ? 'የፋይል ስም ይፈልጉ...' : 'Query matching doc names...'}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-800 bg-black/40 text-xs text-white outline-none focus:border-vip-gold transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="h-10 px-4 rounded-xl bg-vip-gold text-black font-extrabold text-xs cursor-pointer min-h-[40px] hover:brightness-110 active:scale-95 transition"
              >
                {lang === 'amh' ? 'ፈልግ' : 'Search'}
              </button>
            </form>

            {/* Realtime API File list drawer */}
            {isSyncing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-vip-gold animate-spin" />
                <p className="text-xs text-slate-400">{lang === 'amh' ? 'ፋይሎችን በማምጣት ላይ...' : 'Interfacing Google Drive REST gateway...'}</p>
              </div>
            ) : files.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-800/60 rounded-xl space-y-2">
                <p className="text-2xl">📦</p>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-300">
                    {lang === 'amh' ? 'ምንም ሰነድ አልተገኘም' : 'No Files Found'}
                  </p>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal">
                    {lang === 'amh' 
                      ? 'እስካሁን ምንም የጥናት ፎርም ወይንም የሂደት ማስቀመጫ ሰነድ አልያዙም። ከላይ ካሉት "አዲስ ድጋፍ ፍጠር" ቁልፎች አንዱን ይጠቀሙ!' 
                      : 'You do not have any backup files or study check sheets on Drive. Click one of the academic writter buttons above to build your first cloud file!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {files.map((file) => {
                  const isBackupJson = file.name.endsWith('.json');
                  const isTxtChecklist = file.name.endsWith('.txt');
                  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                  return (
                    <div 
                      key={file.id} 
                      className="p-3 rounded-xl border border-slate-800 bg-black/30 hover:border-vip-gold/15 flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-vip-slate/60 border border-slate-800 flex items-center justify-center text-lg text-slate-300 shrink-0">
                          {isFolder ? (
                            <Folder className="w-4 h-4 text-[#38bdf8]" />
                          ) : isBackupJson ? (
                            <Database className="w-4 h-4 text-emerald-400" />
                          ) : isTxtChecklist ? (
                            <FileText className="w-4 h-4 text-vip-gold" />
                          ) : (
                            <Cloud className="w-4 h-4 text-slate-400" />
                          )}
                        </div>

                        <div className="text-left min-w-0">
                          <strong className="block text-xs text-slate-100 font-bold truncate pr-1">
                            {file.name}
                          </strong>
                          <span className="text-[9px] text-slate-500 block leading-tight">
                            {file.createdTime ? new Date(file.createdTime).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Just now'} &bull; {file.size ? `${(parseInt(file.size, 10) / 1024).toFixed(1)} KB` : 'Dynamic'}
                          </span>
                        </div>
                      </div>

                      {/* Utility Action tools */}
                      <div className="flex items-center gap-1 shrink-0">
                        {file.webViewLink && (
                          <a 
                            href={file.webViewLink}
                            target="_blank" 
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg bg-vip-slate/50 text-vip-gold flex items-center justify-center cursor-pointer hover:bg-slate-800 border border-[#cca43b]/10 min-h-[32px]"
                            title="Open in Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button 
                          onClick={() => confirmDeleteFile(file)}
                          className="w-8 h-8 rounded-lg bg-red-950/20 text-red-400 flex items-center justify-center cursor-pointer hover:bg-red-900/30 border border-red-900/40 min-h-[32px]"
                          title="Delete from cloud"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STRICT SAFETY DELETION DIALOGUE MODAL ================= */}
      {/* (Requirement: guidelines specify safe popup modal with clear explanation for destructive events) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-white">
          <div className="w-full max-w-sm bg-[#0b0f19] border border-red-900/40 rounded-3xl p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center text-xl mx-auto animate-bounce">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-red-400 uppercase tracking-widest leading-none">
                {lang === 'amh' ? 'እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ?' : 'Confirm Destructive Deletion'}
              </h4>
              <p className="text-xs text-[#cbd5e1] leading-relaxed max-w-xs mx-auto">
                {lang === 'amh' 
                  ? `"${fileToDelete.name}" የሚለውን የጥናት ማህደር ሰነድ ከእርስዎ የግል ጉግል ድራይቭ ላይ በቋሚነት መሰረዝ ይፈልጋሉ? ይህ ድርጊት ሊመለስ አይችልም።`
                  : `Are you sure you want to permanently delete "${fileToDelete.name}" from your personal Google Drive storage? This action cannot be reverted.`}
              </p>
            </div>

            {isDeleting ? (
              <div className="py-2 flex items-center justify-center gap-2 text-xs text-red-400 font-bold">
                <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
                <span>Removing file from Google Drive...</span>
              </div>
            ) : (
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  className="flex-1 h-11 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800 transition cursor-pointer min-h-[44px]"
                >
                  {lang === 'amh' ? 'አይ' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteExecute}
                  className="flex-1 h-11 rounded-xl text-xs font-bold text-white bg-red-650 hover:bg-red-600 transition cursor-pointer min-h-[44px]"
                >
                  {lang === 'amh' ? 'አዎ ሰርዝ' : 'Confirm & Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
