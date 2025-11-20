import { Check } from 'lucide-react';

export function ProgressIndicator({ steps, currentStep }) {
  const displaySteps = steps.slice(1, -1); // Exclude welcome and activation

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-red-100">
      <div className="flex items-center justify-between overflow-x-auto">
        {displaySteps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 px-2">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : currentStep === step.id
                    ? 'bg-[#E0413D] text-white shadow-lg ring-4 ring-red-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <span className="text-sm md:text-base">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm text-center transition-colors ${
                  currentStep >= step.id ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < displaySteps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-all duration-300 rounded-full ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
