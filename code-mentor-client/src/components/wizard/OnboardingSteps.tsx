import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon, CircleIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
const steps = [{
  name: 'University Info',
  path: '/'
}, {
  name: 'Select Package',
  path: '/select-package'
}, {
  name: 'Payment',
  path: '/checkout'
}, {
  name: 'Confirmation',
  path: '/confirmation'
}];
export const OnboardingSteps: React.FC = () => {
  const location = useLocation();
  const {
    theme
  } = useTheme();
  const currentStepIndex = steps.findIndex(step => location.pathname === step.path || step.path === '/' && location.pathname === '/account-setup');
  return <nav aria-label="Progress" className="mt-6">
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => {
        const isCurrentStep = stepIdx === currentStepIndex;
        const isCompleted = stepIdx < currentStepIndex;
        return <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {stepIdx !== steps.length - 1 && <div className={`absolute top-4 left-0 w-full h-0.5 ${isCompleted ? 'bg-blue-600' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />}
              <div className="relative flex flex-col items-center group">
                <span className="h-9 flex items-center">
                  {isCompleted ? <CheckCircleIcon className="w-8 h-8 text-blue-600" aria-hidden="true" /> : isCurrentStep ? <div className="rounded-full border-2 border-blue-600 h-8 w-8 flex items-center justify-center">
                      <div className="rounded-full bg-blue-600 h-4 w-4" />
                    </div> : <CircleIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} aria-hidden="true" />}
                </span>
                <span className={`text-sm font-medium mt-2 ${isCurrentStep ? 'text-blue-600' : isCompleted ? 'text-blue-600' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            </li>;
      })}
      </ol>
    </nav>;
};