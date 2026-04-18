import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const sessionDismissed = sessionStorage.getItem('installPromptDismissed');
    if (sessionDismissed) {
      setDismissed(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to show the install button
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      // Hide the install banner
      setShowBanner(false);
      setDismissed(true);
      sessionStorage.setItem('installPromptDismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, log the outcome
    if (outcome === 'accepted') {
      setShowBanner(false);
      setDismissed(true);
      sessionStorage.setItem('installPromptDismissed', 'true');
    }
    // Clear the deferredPrompt after use
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  if (dismissed || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-unity-saffron to-orange-500 text-black p-3 flex items-center justify-between shadow-lg z-50 animate-slide-up">
      <div className="flex items-center gap-2">
        <span className="text-xl">📲</span>
        <span className="font-semibold text-sm sm:text-base">Install EktaSahyog App</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Install
        </button>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-black/10 rounded-lg transition-colors"
          aria-label="Close install prompt"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
