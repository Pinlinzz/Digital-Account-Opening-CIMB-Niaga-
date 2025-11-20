import { useState } from 'react';
import './styles/globals.css';
import { Navigation } from './components/Navigation';
import { WelcomeScreen } from './components/WelcomeScreen';
import { KTPUpload } from './components/KTPUpload';
import { SelfieCapture } from './components/SelfieCapture';
import { DukcapilVerification } from './components/DukcapilVerification';
import { ElectronicSignature } from './components/ElectronicSignature';
import { AccountActivation } from './components/AccountActivation';
import { StepIndicator } from './components/StepIndicator';

export interface CustomerData {
  nik?: string;
  nama?: string;
  tanggalLahir?: string;
  alamat?: string;
  ktpImage?: string;
  selfieImage?: string;
  signature?: string;
  accountNumber?: string;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState<CustomerData>({});

  const steps = [
    { id: 1, name: 'Upload e-KTP' },
    { id: 2, name: 'Verifikasi Wajah' },
    { id: 3, name: 'Verifikasi Dukcapil' },
    { id: 4, name: 'Tanda Tangan' },
  ];

  const handleNext = (data?: Partial<CustomerData>) => {
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
    <div className="min-h-screen bg-[#FAFBFC]">
      <Navigation />
      
      <div className="py-6">
        {currentStep > 0 && currentStep < 5 && (
          <div className="section-container mb-6">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
}