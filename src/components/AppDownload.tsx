import React from 'react';
import { Download, Smartphone } from 'lucide-react';

export function AppDownload() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [showInstall, setShowInstall] = React.useState(false);
  const [installStatus, setInstallStatus] = React.useState<'idle' | 'installing' | 'success'>('idle');

  React.useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setInstallStatus('success');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setInstallStatus('installing');
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    
    if (outcome === 'accepted') {
      setInstallStatus('success');
    }
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const downloadAPK = () => {
    // Link to your GitHub Actions artifacts
    window.open('https://github.com/Abrsh444-cyber/AksumPRO-EDU/actions', '_blank');
  };

  if (!showInstall && installStatus !== 'success') return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {installStatus === 'success' && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ✓ App installed successfully!
        </div>
      )}
      
      {showInstall && (
        <button
          onClick={handleInstall}
          disabled={installStatus === 'installing'}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg"
        >
          <Smartphone size={20} />
          {installStatus === 'installing' ? 'Installing...' : 'Install App'}
        </button>
      )}
      
      <button
        onClick={downloadAPK}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg"
      >
        <Download size={20} />
        Download APK
      </button>
    </div>
  );
}
