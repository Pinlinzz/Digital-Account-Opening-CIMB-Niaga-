import { Check } from 'lucide-react';

export function ProgressIndicator({ steps, currentStep }) {
  const displaySteps = steps.slice(1, -1); // Exclude welcome and activation

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        {displaySteps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < displaySteps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-all ${
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
