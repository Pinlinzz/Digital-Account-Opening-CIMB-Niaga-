import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { KTPUpload } from './components/KTPUpload';
import { SelfieCapture } from './components/SelfieCapture';
import { DukcapilVerification } from './components/DukcapilVerification';
import { ElectronicSignature } from './components/ElectronicSignature';
import { AccountActivation } from './components/AccountActivation';
import { ProgressIndicator } from './components/ProgressIndicator';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState({});

  const steps = [
    { id: 0, name: 'Selamat Datang', component: 'welcome' },
    { id: 1, name: 'Upload e-KTP', component: 'ktp' },
    { id: 2, name: 'Verifikasi Wajah', component: 'selfie' },
    { id: 3, name: 'Verifikasi Dukcapil', component: 'dukcapil' },
    { id: 4, name: 'Tanda Tangan', component: 'signature' },
    { id: 5, name: 'Aktivasi Rekening', component: 'activation' },
  ];

  const handleNext = (data) => {
    if (data) {
      setCustomerData({ ...customerData, ...data });
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onNext={handleNext} />;
      case 1:
        return <KTPUpload onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <SelfieCapture onNext={handleNext} onBack={handleBack} ktpImage={customerData.ktpImage} />;
      case 3:
        return <DukcapilVerification customerData={customerData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <ElectronicSignature customerData={customerData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <AccountActivation customerData={customerData} />;
      default:
        return <WelcomeScreen onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep > 0 && currentStep < 5 && (
          <ProgressIndicator steps={steps} currentStep={currentStep} />
        )}
        <div className="mt-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
