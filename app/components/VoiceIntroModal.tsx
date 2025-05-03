'use client';

import { useState, useEffect } from 'react';

export default function VoiceIntroModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show the modal once per session
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenVoiceIntro');
    if (!hasSeenIntro) {
      // Wait a moment before showing the modal
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenVoiceIntro', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close introduction"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold text-[#4A4A4A] mb-4 flex items-center">
          <span className="mr-2">Voice Commands Available!</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#F5A623]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </h2>
        
        <p className="text-gray-600 mb-4">
          This website supports hands-free cooking with voice commands! Here are some things you can try:
        </p>
        
        <ul className="space-y-2 mb-4 text-gray-700">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-[#F5A623] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>"Find me a chicken recipe"</strong> - Search for recipes</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-[#F5A623] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>"Next step"</strong> - Navigate recipe instructions</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-[#F5A623] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>"Set a timer for 5 minutes"</strong> - Start a countdown</span>
          </li>
        </ul>
        
        <p className="text-gray-600 mb-6 text-sm">
          Click the microphone button in the bottom-right corner to start using voice commands. Click the help icon in the bottom-left for a full list of commands.
        </p>
        
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[#F5A623] hover:bg-[#e09215] text-white font-medium px-6 py-2 rounded-full transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
} 