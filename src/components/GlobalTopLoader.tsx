import React, { useEffect, useState } from 'react';
import { subscribeToApiLoading } from '../services/api';
import { Loader2, Server } from 'lucide-react';

export const GlobalTopLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    let slowTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = subscribeToApiLoading((count) => {
      const active = count > 0;
      setIsLoading(active);

      if (active) {
        // If request takes more than 2 seconds, indicate cold start
        if (!slowTimer) {
          slowTimer = setTimeout(() => {
            setIsSlow(true);
          }, 2000);
        }
      } else {
        if (slowTimer) {
          clearTimeout(slowTimer);
          slowTimer = null;
        }
        setIsSlow(false);
      }
    });

    return () => {
      unsubscribe();
      if (slowTimer) clearTimeout(slowTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <>
      {/* Sleek top glowing progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-900/40 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 animate-pulse w-full origin-left duration-500" />
      </div>

      {/* Floating status pill */}
      <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900/95 border border-indigo-500/30 text-white text-xs font-medium rounded-full shadow-2xl shadow-indigo-950/60 backdrop-blur-md">
          <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>
            {isSlow ? (
              <span className="flex items-center gap-1.5 text-amber-300">
                <Server className="w-3.5 h-3.5" />
                <span>Waking up cloud server (Render free tier), please wait...</span>
              </span>
            ) : (
              'Fetching data from server...'
            )}
          </span>
        </div>
      </div>
    </>
  );
};
