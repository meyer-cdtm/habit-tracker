'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { ExtractedHabit } from '@/types/habit';
import { extractHabitsFromMessage } from '@/utils/habitParser';
import HabitPreview from './HabitPreview';
import SummaryModal from './SummaryModal';

interface VoiceOnboardingProps {
  onComplete: (habits: ExtractedHabit[]) => void;
  onBackToChat: () => void;
}

export default function VoiceOnboarding({ onComplete, onBackToChat }: VoiceOnboardingProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [extractedHabits, setExtractedHabits] = useState<ExtractedHabit[]>([]);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const vapiRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize VAPI
    if (!vapiRef.current && process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('Call started');
        setIsCallActive(true);
        startTimer();
      });

      vapiRef.current.on('call-end', () => {
        console.log('Call ended');
        setIsCallActive(false);
        stopTimer();
      });

      vapiRef.current.on('speech-start', () => {
        setAssistantSpeaking(true);
      });

      vapiRef.current.on('speech-end', () => {
        setAssistantSpeaking(false);
      });

      vapiRef.current.on('message', (message: any) => {
        console.log('Message:', message);

        if (message.type === 'transcript' && message.transcriptType === 'final') {
          // Add transcript
          const text = message.transcript;
          setTranscript((prev) => [...prev, text]);

          // Extract habits from the transcript
          const newHabits = extractHabitsFromMessage(text);
          if (newHabits.length > 0) {
            setExtractedHabits((prev) => [...prev, ...newHabits]);
          }
        }
      });

      vapiRef.current.on('volume-level', (level: number) => {
        setVolumeLevel(level);
      });

      vapiRef.current.on('error', (error: any) => {
        console.error('VAPI Error:', error);
      });
    }

    return () => {
      // Cleanup
      if (vapiRef.current && isCallActive) {
        vapiRef.current.stop();
      }
      stopTimer();
    };
  }, []);


  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) {
      alert('VAPI Assistant ID not configured. Please add NEXT_PUBLIC_VAPI_ASSISTANT_ID to your .env.local file.');
      return;
    }

    try {
      await vapiRef.current?.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start call. Please check your VAPI configuration.');
    }
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setIsCallActive(false);
    setCallDuration(0);
    stopTimer();
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };


  const handleShowSummary = () => {
    endCall();
    if (extractedHabits.length > 0) {
      setShowSummary(true);
    }
  };

  const handleConfirmHabits = () => {
    onComplete(extractedHabits);
  };

  const handleBackToVoice = () => {
    setShowSummary(false);
  };

  return (
    <>
      {showSummary && (
        <SummaryModal
          habits={extractedHabits}
          onConfirm={handleConfirmHabits}
          onBack={handleBackToVoice}
        />
      )}
      <div className="flex flex-col h-screen max-h-screen bg-[#0f1117]">
      {/* Minimal Header */}
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-400">Voice Mode</span>
        </div>
        <button
          onClick={onBackToChat}
          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Exit
        </button>
      </div>

      {/* Call Interface - ChatGPT Voice Style */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Large Orb Avatar */}
        <div className="relative mb-12">
          <div
            className={`w-64 h-64 rounded-full flex items-center justify-center transition-all duration-500 ${
              assistantSpeaking ? 'animate-pulse-glow' : ''
            }`}
            style={{
              background: assistantSpeaking
                ? 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.4) 50%, rgba(67, 56, 202, 0.1) 100%)'
                : 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(79, 70, 229, 0.2) 50%, rgba(67, 56, 202, 0.05) 100%)',
              boxShadow: assistantSpeaking
                ? `0 0 ${80 + volumeLevel * 60}px rgba(99, 102, 241, 0.6), 0 0 ${40 + volumeLevel * 30}px rgba(99, 102, 241, 0.4)`
                : '0 0 60px rgba(99, 102, 241, 0.2)',
            }}
          >
            {/* Inner orb */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500"></div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-12">
          {isCallActive ? (
            <>
              <p className="text-gray-400 text-sm mb-1">{formatDuration(callDuration)}</p>
              <p className="text-white text-lg font-medium">
                {assistantSpeaking ? 'Speaking...' : 'Listening...'}
              </p>
            </>
          ) : (
            <>
              <p className="text-white text-xl font-medium mb-2">Voice Coaching</p>
              <p className="text-gray-400 text-sm">Start a conversation to discover your habits</p>
            </>
          )}
        </div>

        {/* Call Controls - Minimal Style */}
        <div className="flex items-center justify-center gap-4">
          {isCallActive ? (
            <>
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </>
          ) : (
            <button
              onClick={startCall}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all"
            >
              <Phone className="w-7 h-7" />
            </button>
          )}
        </div>
      </div>

      {/* Transcript - Minimal Display */}
      {isCallActive && transcript.length > 0 && (
        <div className="flex-none px-6 pb-6">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto border border-gray-800">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Transcript</p>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {transcript.slice(-2).map((text, index) => (
                <p key={index} className="text-sm text-gray-300">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Habit Preview - Fixed at bottom */}
      {extractedHabits.length > 0 && (
        <div className="flex-none px-6 pb-6 animate-slide-up">
          <div className="max-w-2xl mx-auto">
            <HabitPreview habits={extractedHabits} onComplete={handleShowSummary} />
          </div>
        </div>
      )}
      </div>
    </>
  );
}
