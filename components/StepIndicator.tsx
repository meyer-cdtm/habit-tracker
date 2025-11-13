'use client';

import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  emoji: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white scale-100'
                      : isActive
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white scale-110 shadow-lg'
                      : 'bg-gray-200 text-gray-400 scale-90'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-lg">{step.emoji}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium transition-colors ${
                    isActive ? 'text-purple-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-1 mx-2 mb-5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
