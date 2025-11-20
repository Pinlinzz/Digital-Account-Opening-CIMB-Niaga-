import { Check } from 'lucide-react';

export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isUpcoming = currentStep < step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step */}
              <div className="flex flex-col items-center flex-1 relative">
                {/* Circle */}
                <div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 font-semibold text-sm
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${isActive ? 'bg-[#E0413D] text-white ring-4 ring-red-50' : ''}
                    ${isUpcoming ? 'bg-gray-100 text-gray-400 border-2 border-gray-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Label */}
                <div
                  className={`
                    mt-3 text-sm text-center transition-colors hidden sm:block
                    ${isActive ? 'text-gray-900 font-semibold' : ''}
                    ${isCompleted ? 'text-gray-700 font-medium' : ''}
                    ${isUpcoming ? 'text-gray-400 font-medium' : ''}
                  `}
                >
                  {step.name}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 -mt-8 relative">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <div
                    className={`
                      absolute inset-0 bg-green-600 rounded-full transition-all duration-300
                      ${isCompleted ? 'w-full' : 'w-0'}
                    `}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
