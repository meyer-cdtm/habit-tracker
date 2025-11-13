'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { ExtractedHabit } from '@/types/habit';
import { extractHabitsFromMessage } from '@/utils/habitParser';
import HabitPreview from './HabitPreview';
import StepIndicator from './StepIndicator';
import SummaryModal from './SummaryModal';

interface VoiceOnboardingProps {
  onComplete: (habits: ExtractedHabit[]) => void;
  onBackToChat: () => void;
}

const ONBOARDING_STEPS = [
  { id: 1, label: 'Goals', emoji: '🎯' },
  { id: 2, label: 'Habits', emoji: '✨' },
  { id: 3, label: 'Details', emoji: '📋' },
  { id: 4, label: 'Review', emoji: '✅' },
];

export default function VoiceOnboarding({ onComplete, onBackToChat }: VoiceOnboardingProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
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

  // Update steps based on progress
  useEffect(() => {
    const messageCount = transcript.length;
    if (extractedHabits.length > 0) {
      setCurrentStep(4);
    } else if (messageCount >= 8) {
      setCurrentStep(3);
    } else if (messageCount >= 4) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [transcript.length, extractedHabits.length]);

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

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Note: Speaker control is handled by the device
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
      <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="flex-none px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Voice Onboarding</h1>
              <p className="text-sm text-purple-200">AI Habit Coach</p>
            </div>
          </div>

          <button
            onClick={onBackToChat}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium transition-all touch-manipulation"
          >
            Switch to Chat
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Call Interface */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Avatar/Waveform Area */}
        <div className="relative mb-8">
          <div
            className={`w-48 h-48 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center transition-all duration-300 ${
              assistantSpeaking ? 'scale-110 shadow-2xl' : 'scale-100'
            }`}
            style={{
              boxShadow: assistantSpeaking
                ? `0 0 ${60 + volumeLevel * 40}px rgba(168, 85, 247, 0.6)`
                : '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Sparkles className="w-24 h-24 text-white" />
          </div>

          {/* Speaking indicator */}
          {isCallActive && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-sm font-medium text-gray-800">
                  {assistantSpeaking ? 'Coach is speaking...' : 'Listening...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call Status */}
        <div className="text-center mb-8">
          {isCallActive ? (
            <>
              <p className="text-white text-2xl font-semibold mb-2">Call Active</p>
              <p className="text-purple-200 text-lg">{formatDuration(callDuration)}</p>
            </>
          ) : (
            <>
              <p className="text-white text-2xl font-semibold mb-2">Ready to Start</p>
              <p className="text-purple-200 text-sm">Tap the call button to begin your voice onboarding</p>
            </>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-6 mb-8">
          {isCallActive ? (
            <>
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all touch-manipulation ${
                  isMuted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 touch-manipulation"
              >
                <PhoneOff className="w-9 h-9" />
              </button>

              {/* Speaker Button */}
              <button
                onClick={toggleSpeaker}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all touch-manipulation ${
                  isSpeakerOn
                    ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    : 'bg-red-500 text-white'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
              </button>
            </>
          ) : (
            <button
              onClick={startCall}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 touch-manipulation"
            >
              <Phone className="w-9 h-9" />
            </button>
          )}
        </div>
      </div>

      {/* Habit Preview - Fixed at bottom */}
      {extractedHabits.length > 0 && (
        <div className="flex-none px-4 pb-4 animate-slide-up">
          <HabitPreview habits={extractedHabits} onComplete={handleShowSummary} />
        </div>
      )}

      {/* Transcript (optional, can be hidden) */}
      {transcript.length > 0 && (
        <div className="flex-none px-6 pb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-h-32 overflow-y-auto">
            <p className="text-xs text-purple-200 mb-2 font-medium">Transcript:</p>
            {transcript.slice(-3).map((text, index) => (
              <p key={index} className="text-sm text-white/90 mb-1">
                {text}
              </p>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
