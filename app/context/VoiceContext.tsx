'use client';

import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { searchRecipes, getRecipeById } from '../utils/recipeData';
import { playTimerEndSound, playActivationSound } from '../utils/audioUtils';

interface VoiceContextType {
  isListening: boolean;
  toggleListening: () => void;
  heardCommand: string;
  responseMessage: string;
  timerActive: boolean;
  timerMinutes: number;
  timerSeconds: number;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  hasBrowserSupport: boolean;
  isSearching: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [heardCommand, setHeardCommand] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [hasBrowserSupport, setHasBrowserSupport] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check browser support for Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setHasBrowserSupport(false);
        setResponseMessage('Voice commands are not supported in this browser');
      } else {
        initializeSpeechRecognition();
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else if (timerMinutes > 0) {
            setTimerMinutes(prevMinutes => prevMinutes - 1);
            return 59;
          } else {
            // Timer finished
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            setTimerActive(false);
            speak("Time's up!");
            setResponseMessage("Time's up!");
            playTimerEndSound();
            return 0;
          }
        });
      }, 1000);
      
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [timerActive, timerMinutes, timerSeconds]);
  
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onresult = (event: any) => {
      const command = event.results[0][0].transcript.trim().toLowerCase();
      setHeardCommand(command);
      handleVoiceCommand(command);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setResponseMessage(`Error: ${event.error}`);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };
  
  const toggleListening = () => {
    if (!hasBrowserSupport) {
      setResponseMessage('Voice commands are not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setHeardCommand('Listening...');
      setResponseMessage('');
      recognitionRef.current.start();
      setIsListening(true);
      playActivationSound();
      
      // Auto-stop after 5 seconds of no speech
      setTimeout(() => {
        if (isListening && heardCommand === 'Listening...') {
          recognitionRef.current.stop();
          setHeardCommand('');
          setResponseMessage('No speech detected');
        }
      }, 5000);
    }
  };
  
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const handleVoiceCommand = async (command: string) => {
    // Search command
    if (command.includes('find me') || command.includes('search for')) {
      const searchTerms = command
        .replace('find me', '')
        .replace('a', '')
        .replace('search for', '')
        .replace('recipe', '')
        .trim();
      
      if (searchTerms) {
        const responseText = `Searching for ${searchTerms}`;
        setResponseMessage(responseText);
        speak(responseText);
        setIsSearching(true);
        
        try {
          // Get search results before navigation to show count
          const results = await searchRecipes(searchTerms);
          const resultText = `Found ${results.length} recipe${results.length !== 1 ? 's' : ''} for ${searchTerms}`;
          setResponseMessage(resultText);
          speak(resultText);
          
          // Navigate to search page
          router.push(`/search?q=${encodeURIComponent(searchTerms)}`);
        } catch (error) {
          console.error('Error searching recipes:', error);
          const errorText = 'Sorry, I had trouble searching for recipes';
          setResponseMessage(errorText);
          speak(errorText);
        } finally {
          setIsSearching(false);
        }
      } else {
        const errorText = 'Please specify what to search for';
        setResponseMessage(errorText);
        speak(errorText);
      }
      return;
    }
    
    // Navigation commands
    if (command.includes('go back')) {
      setResponseMessage('Going back');
      speak('Going back');
      router.back();
      return;
    }
    
    if (command.includes('go to homepage') || command.includes('go home')) {
      setResponseMessage('Going to homepage');
      speak('Going to homepage');
      router.push('/');
      return;
    }
    
    // Timer commands
    if (command.includes('set a timer') || command.includes('timer for')) {
      const minutesMatch = command.match(/(\d+)\s*minute/);
      if (minutesMatch && minutesMatch[1]) {
        const minutes = parseInt(minutesMatch[1], 10);
        if (minutes > 0 && minutes <= 60) {
          setTimerMinutes(minutes);
          setTimerSeconds(0);
          setTimerActive(true);
          const responseText = `Timer set for ${minutes} minute${minutes === 1 ? '' : 's'}`;
          setResponseMessage(responseText);
          speak(responseText);
        } else {
          const errorText = 'Please set a timer between 1 and 60 minutes';
          setResponseMessage(errorText);
          speak(errorText);
        }
      } else {
        const errorText = "I didn't catch how many minutes. Please try again.";
        setResponseMessage(errorText);
        speak(errorText);
      }
      return;
    }
    
    // Recipe page commands
    if (pathname && pathname.includes('/recipe/')) {
      const recipeId = parseInt(pathname.split('/').pop() || '0', 10);
      
      try {
        const recipe = await getRecipeById(recipeId);
        
        if (recipe) {
          // Step navigation
          if (command === 'next step') {
            if (currentStepIndex < recipe.steps.length - 1) {
              const newIndex = currentStepIndex + 1;
              setCurrentStepIndex(newIndex);
              const stepText = `Step ${newIndex + 1}: ${recipe.steps[newIndex]}`;
              setResponseMessage(stepText);
              speak(stepText);
              scrollToStep(newIndex);
            } else {
              const endText = 'That was the last step';
              setResponseMessage(endText);
              speak(endText);
            }
            return;
          }
          
          if (command === 'previous step') {
            if (currentStepIndex > 0) {
              const newIndex = currentStepIndex - 1;
              setCurrentStepIndex(newIndex);
              const stepText = `Step ${newIndex + 1}: ${recipe.steps[newIndex]}`;
              setResponseMessage(stepText);
              speak(stepText);
              scrollToStep(newIndex);
            } else {
              const startText = 'This is the first step';
              setResponseMessage(startText);
              speak(startText);
            }
            return;
          }
          
          if (command === 'repeat step') {
            const stepText = `Step ${currentStepIndex + 1}: ${recipe.steps[currentStepIndex]}`;
            setResponseMessage(stepText);
            speak(stepText);
            scrollToStep(currentStepIndex);
            return;
          }
          
          if (command === 'read all steps') {
            const stepsText = recipe.steps.map((step, index) => `Step ${index + 1}: ${step}`).join('. ');
            setResponseMessage('Reading all steps');
            speak(stepsText);
            return;
          }
          
          // Section navigation
          if (command.includes('show ingredients')) {
            setResponseMessage('Showing ingredients');
            speak('Showing ingredients');
            scrollToIngredients();
            return;
          }
          
          if (command.includes('show instructions') || command.includes('show steps')) {
            setResponseMessage('Showing instructions');
            speak('Showing instructions');
            scrollToInstructions();
            return;
          }
        }
      } catch (error) {
        console.error('Error getting recipe for voice commands:', error);
      }
    }
    
    // If no command matched
    const errorText = "Sorry, I didn't understand that command";
    setResponseMessage(errorText);
    speak(errorText);
  };
  
  const scrollToStep = (index: number) => {
    try {
      const stepElement = document.getElementById(`step-${index}`);
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error('Error scrolling to step', error);
    }
  };
  
  const scrollToIngredients = () => {
    try {
      const ingredientsSection = document.getElementById('ingredients-section');
      if (ingredientsSection) {
        ingredientsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error scrolling to ingredients', error);
    }
  };
  
  const scrollToInstructions = () => {
    try {
      const instructionsSection = document.getElementById('instructions-section');
      if (instructionsSection) {
        instructionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error scrolling to instructions', error);
    }
  };
  
  const value = {
    isListening,
    toggleListening,
    heardCommand,
    responseMessage,
    timerActive,
    timerMinutes,
    timerSeconds,
    currentStepIndex,
    setCurrentStepIndex,
    hasBrowserSupport,
    isSearching
  };
  
  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
} 