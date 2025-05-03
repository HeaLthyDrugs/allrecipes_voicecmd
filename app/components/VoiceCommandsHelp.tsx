'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function VoiceCommandsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const isRecipePage = pathname.includes('/recipe/');
  
  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed left-6 bottom-6 z-40">
      <button
        onClick={toggleHelp}
        className="bg-white border border-gray-300 rounded-full h-12 w-12 sm:h-12 sm:w-12 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
        aria-label={isOpen ? 'Close voice commands help' : 'Show voice commands help'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 sm:w-80">
          <h3 className="font-bold text-lg mb-2 text-[#4A4A4A]">Voice Commands</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-1">Search</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>"Find me a [recipe name]"</li>
                <li>"Search for [ingredient]"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-1">Navigation</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>"Go back"</li>
                <li>"Go to homepage"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-1">Timer</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>"Set a timer for [X] minutes"</li>
              </ul>
            </div>
            
            {isRecipePage && (
              <>
                <div>
                  <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-1">Recipe Steps</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>"Next step"</li>
                    <li>"Previous step"</li>
                    <li>"Repeat step"</li>
                    <li>"Read all steps"</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-sm text-[#F5A623] uppercase mb-1">Recipe Navigation</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>"Show ingredients"</li>
                    <li>"Show instructions"</li>
                  </ul>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={toggleHelp}
            className="mt-4 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
} 