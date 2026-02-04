
import React, { useEffect, useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* global google */
    const initGoogle = () => {
      if (typeof (window as any).google !== 'undefined') {
        try {
          (window as any).google.accounts.id.initialize({
            // NOTE: Replace this with your actual Client ID from Google Cloud Console
            // to make the real OAuth flow work on your domain.
            client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", 
            callback: (response: any) => {
              try {
                const payload = JSON.parse(atob(response.credential.split('.')[1]));
                onLogin({
                  id: payload.sub,
                  name: payload.name,
                  email: payload.email,
                  picture: payload.picture
                });
              } catch (e) {
                console.error("JWT Parsing Error:", e);
                setError("Failed to process login data.");
              }
            }
          });
          
          (window as any).google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            { theme: "outline", size: "large", width: "320", shape: "pill" }
          );
        } catch (err) {
          console.error("Google Auth Init Error:", err);
        }
      }
    };

    // Small delay to ensure script is fully ready
    const timer = setTimeout(initGoogle, 1000);
    return () => clearTimeout(timer);
  }, [onLogin]);

  const handleDemoLogin = () => {
    onLogin({
      id: "demo-user-123",
      name: "Sydney Explorer",
      email: "demo@sydneyhub.com",
      picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sydney"
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-12 text-center transform hover:scale-[1.01] transition-transform duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-brand-700 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/30 rotate-3">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">SydneyHub</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium leading-relaxed">The ultimate dashboard for discovering and managing events in Sydney.</p>
        
        <div className="space-y-4">
          <div className="flex justify-center" id="googleBtn"></div>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-bold tracking-widest">Or</span></div>
          </div>

          <button 
            onClick={handleDemoLogin}
            className="w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-lg active:scale-95"
          >
            Sign in as Guest (Demo)
          </button>
        </div>

        {error && <p className="mt-4 text-xs text-red-500 font-bold">{error}</p>}
        
        <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex justify-center space-x-6">
          <a href="#" className="hover:text-indigo-500 transition">Privacy</a>
          <a href="#" className="hover:text-indigo-500 transition">Terms</a>
          <a href="#" className="hover:text-indigo-500 transition">Support</a>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">Production Ready v2.4.0</p>
    </div>
  );
};

export default Login;
