import { useState, useEffect } from 'react';
import { Shield, Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import type { CustomerData } from '../App';

interface DukcapilVerificationProps {
  customerData: CustomerData;
  onNext: () => void;
  onBack: () => void;
}

// Mock Dukcapil API Integration
const mockDukcapilVerification = async (nik: string): Promise<{
  success: boolean;
  verified: boolean;
  data?: {
    nik: string;
    nama: string;
    tanggalLahir: string;
    statusKTP: string;
    validUntil: string;
  };
  error?: string;
}> => {
  // Simulate API call time
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Simulate 98% success rate
  const random = Math.random();
  
  if (random < 0.98) {
    return {
      success: true,
      verified: true,
      data: {
        nik: nik,
        nama: 'CONTOH NASABAH BARU',
        tanggalLahir: '15-08-1990',
        statusKTP: 'AKTIF',
        validUntil: 'SEUMUR HIDUP',
      },
    };
  } else {
    return {
      success: false,
      verified: false,
      error: 'NIK tidak ditemukan di database Dukcapil atau data tidak sesuai',
    };
  }
};

export function DukcapilVerification({ customerData, onNext, onBack }: DukcapilVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    startVerification();
  }, []);

  const startVerification = async () => {
    setIsVerifying(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const result = await mockDukcapilVerification(customerData.nik || '');
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.verified) {
        setVerificationResult(result);
      } else {
        setError(result.error || 'Verifikasi gagal');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError('Terjadi kesalahan pada sistem verifikasi');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    setVerificationResult(null);
    setError(null);
    startVerification();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Verifikasi Data Dukcapil</CardTitle>
              <CardDescription>
                Memverifikasi identitas Anda dengan database Direktorat Jenderal Kependudukan dan Pencatatan Sipil
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Data yang Akan Diverifikasi:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">NIK:</span>
                <p className="font-mono">{customerData.nik}</p>
              </div>
              <div>
                <span className="text-gray-600">Nama:</span>
                <p>{customerData.nama}</p>
              </div>
              <div>
                <span className="text-gray-600">Tanggal Lahir:</span>
                <p>{customerData.tanggalLahir}</p>
              </div>
            </div>
          </div>

          {isVerifying && (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertDescription className="text-blue-800">
                  <p className="font-semibold mb-2">Sedang memverifikasi data...</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>Menghubungkan ke server Dukcapil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Memvalidasi NIK dan data personal</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress Verifikasi</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {verificationResult && verificationResult.verified && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ✓ Data Anda telah terverifikasi dengan database Dukcapil
                </AlertDescription>
              </Alert>

              <div className="bg-green-50 rounded-lg p-4 space-y-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Hasil Verifikasi Dukcapil:</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700">NIK:</span>
                    <p className="font-mono text-green-900">{verificationResult.data.nik}</p>
                  </div>
                  <div>
                    <span className="text-green-700">Nama:</span>
                    <p className="text-green-900">{verificationResult.data.nama}</p>
                  </div>
                  <div>
                    <span className="text-green-700">Tanggal Lahir:</span>
                    <p className="text-green-900">{verificationResult.data.tanggalLahir}</p>
                  </div>
                  <div>
                    <span className="text-green-700">Status e-KTP:</span>
                    <p className="text-green-900 font-semibold">{verificationResult.data.statusKTP}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-green-700">Berlaku Hingga:</span>
                    <p className="text-green-900">{verificationResult.data.validUntil}</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Data Anda telah diverifikasi dan cocok dengan database kependudukan resmi.
                  Silakan lanjutkan ke tahap berikutnya.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Coba Verifikasi Ulang
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Kembali
            </Button>
            <Button
              onClick={onNext}
              disabled={!verificationResult?.verified}
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
