'use client';

import { useState, useEffect } from 'react';
import { useVoice } from '../context/VoiceContext';

export default function MicrophoneButton() {
  const {
    isListening,
    toggleListening,
    heardCommand,
    responseMessage,
    timerActive,
    timerMinutes,
    timerSeconds,
    hasBrowserSupport,
    isSearching
  } = useVoice();
  
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Show feedback when there's a command or response
  useEffect(() => {
    if (heardCommand || responseMessage || isSearching) {
      setShowFeedback(true);
      // Hide feedback after 5 seconds of inactivity
      const timer = setTimeout(() => {
        if (!isListening && !timerActive && !isSearching) {
          setShowFeedback(false);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [heardCommand, responseMessage, isListening, timerActive, isSearching]);
  
  // Format time as MM:SS
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Timer display */}
      {timerActive && (
        <div className="absolute bottom-full right-0 mb-16 bg-white border border-gray-300 shadow-lg p-3 rounded-lg text-sm whitespace-nowrap">
          <div className="font-bold text-center">Timer</div>
          <div className="text-2xl text-center">{formatTime(timerMinutes, timerSeconds)}</div>
        </div>
      )}
      
      {/* Feedback box */}
      {showFeedback && (
        <div className="absolute bottom-full right-0 mb-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm max-w-xs" 
             aria-live="polite">
          {isSearching && (
            <div className="flex items-center mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              <span>Searching for recipes...</span>
            </div>
          )}
          {heardCommand && !isSearching && (
            <div className="mb-1">
              <span className="font-semibold">Heard:</span> {heardCommand}
            </div>
          )}
          {responseMessage && (
            <div>
              <span className="font-semibold">Response:</span> {responseMessage}
            </div>
          )}
          <div className="absolute -bottom-2 right-5 w-4 h-4 bg-black bg-opacity-75 transform rotate-45"></div>
        </div>
      )}
      
      {/* Microphone button */}
      <button
        onClick={toggleListening}
        className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 ${
          isListening
            ? 'bg-red-500 animate-pulse ring-4 ring-red-300'
            : isSearching
            ? 'bg-blue-500 animate-pulse'
            : 'bg-[#F5A623] hover:bg-[#e09215]'
        } ${
          !hasBrowserSupport ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!hasBrowserSupport || isSearching}
        aria-label={
          isListening
            ? 'Stop listening (Voice command active)'
            : isSearching
            ? 'Searching recipes...'
            : hasBrowserSupport
            ? 'Start voice command'
            : 'Voice commands not supported in this browser'
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isListening ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          ) : isSearching ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
      </button>
    </div>
  );
} 