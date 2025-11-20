import { useState, useRef } from 'react';
import { AlertCircle, CheckCircle, Loader2, X, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import type { CustomerData } from '../App';

interface SelfieCaptureProps {
  onNext: (data: Partial<CustomerData>) => void;
  onBack: () => void;
  ktpImage?: string;
}

// Mock Liveness Detection & Face Matching
const mockLivenessCheck = async (selfieData: string, ktpData?: string): Promise<{
  success: boolean;
  livenessScore: number;
  faceMatchScore?: number;
  spoofingDetected: boolean;
  error?: string;
}> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));

  const random = Math.random();
  
  // Simulate 95% success rate for liveness
  if (random < 0.05) {
    return {
      success: false,
      livenessScore: 50 + Math.random() * 30,
      spoofingDetected: true,
      error: 'Terdeteksi kemungkinan spoofing. Pastikan Anda menggunakan wajah asli, bukan foto atau video.',
    };
  }

  // Simulate high liveness and face match scores
  return {
    success: true,
    livenessScore: 96 + Math.random() * 3,
    faceMatchScore: 95 + Math.random() * 4,
    spoofingDetected: false,
  };
};

export function SelfieCapture({ onNext, onBack, ktpImage }: SelfieCaptureProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setImage(imageData);
      setError(null);
      setVerificationResult(null);

      // Process liveness detection and face matching
      setIsProcessing(true);
      const result = await mockLivenessCheck(imageData, ktpImage);
      setIsProcessing(false);

      if (result.success) {
        setVerificationResult(result);
      } else {
        setError(result.error || 'Gagal memverifikasi wajah');
        setImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setImage(null);
    setVerificationResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    if (verificationResult?.success) {
      onNext({
        selfieImage: image || undefined,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle>Verifikasi Wajah & Liveness Check</CardTitle>
          <CardDescription>
            Ambil foto selfie Anda untuk verifikasi identitas dan deteksi keaslian (liveness detection)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!image ? (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <UserCheck className="w-12 h-12 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-2">Klik untuk ambil foto selfie</p>
                <p className="text-sm text-gray-500">Format: JPG, PNG (Max: 5MB)</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Panduan Selfie:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Pastikan wajah Anda terlihat jelas dan menghadap kamera</li>
                    <li>Lepas kacamata, masker, atau topi</li>
                    <li>Pencahayaan cukup terang</li>
                    <li>Posisi wajah lurus, tidak miring</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={image} 
                  alt="Selfie preview" 
                  className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-200"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRetake}
                >
                  <X className="w-4 h-4 mr-1" />
                  Foto Ulang
                </Button>
              </div>

              {isProcessing && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  <AlertDescription className="text-blue-800">
                    <div className="space-y-1">
                      <p>Melakukan verifikasi biometrik...</p>
                      <p className="text-sm">• Liveness detection (anti-spoofing)</p>
                      <p className="text-sm">• Face matching dengan e-KTP</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {verificationResult && verificationResult.success && (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Verifikasi berhasil! Identitas Anda telah terverifikasi.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">Hasil Verifikasi:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Liveness Score:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${verificationResult.livenessScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {verificationResult.livenessScore.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Face Match Score:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${verificationResult.faceMatchScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-blue-600">
                            {verificationResult.faceMatchScore?.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">Anti-Spoofing:</span>
                        <span className="text-sm font-semibold text-green-600">
                          ✓ Passed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Kembali
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!verificationResult || isProcessing}
              className="flex-1"
            >
              Lanjutkan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
