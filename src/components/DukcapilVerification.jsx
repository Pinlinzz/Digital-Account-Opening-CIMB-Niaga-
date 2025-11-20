import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Shield, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

const mockDukcapilVerification = async (customerData) => {
  await new Promise(resolve => setTimeout(resolve, 4000));
  const random = Math.random();
  
  if (random < 0.02) {
    return {
      success: false,
      error: 'Data tidak cocok dengan database Dukcapil. Pastikan data e-KTP Anda sudah benar.',
    };
  }

  return {
    success: true,
    verified: true,
    message: 'Data terverifikasi dengan database Dukcapil',
    timestamp: new Date().toISOString(),
  };
};

export function DukcapilVerification({ customerData, onNext, onBack }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startVerification = async () => {
    setHasStarted(true);
    setIsVerifying(true);
    setError(null);
    
    try {
      const result = await mockDukcapilVerification(customerData);
      
      if (result.success) {
        setVerificationResult(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat verifikasi. Silakan coba lagi.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="section-container max-w-4xl py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-10 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">Langkah 3 dari 4</span>
            <span>•</span>
            <span>Verifikasi Dukcapil</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Verifikasi Data Kependudukan
          </h2>
          <p className="text-gray-600">
            Kami akan memverifikasi data Anda dengan database Dukcapil untuk memastikan keaslian identitas
          </p>
        </div>

        {/* Data Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Data yang akan diverifikasi:</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">NIK</p>
              <p className="font-medium text-gray-900">{customerData.nik}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
              <p className="font-medium text-gray-900">{customerData.nama}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Tanggal Lahir</p>
              <p className="font-medium text-gray-900">{customerData.tanggalLahir}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Alamat</p>
              <p className="font-medium text-gray-900">{customerData.alamat}</p>
            </div>
          </div>
        </div>

        {/* Before Start */}
        {!hasStarted && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Klik tombol di bawah untuk memulai proses verifikasi
              </p>
              <Button
                onClick={startVerification}
                className="bg-[#E0413D] hover:bg-[#C73632] h-12 px-8"
              >
                Mulai Verifikasi
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-sm">Proses verifikasi:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• Memverifikasi NIK dengan database Dukcapil</li>
                    <li>• Mencocokkan data pribadi Anda</li>
                    <li>• Memastikan validitas dokumen</li>
                    <li>• Proses memakan waktu sekitar 10-15 detik</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verifying */}
        {isVerifying && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-10 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sedang Memverifikasi Data
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Menghubungkan ke database Dukcapil...
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <Button
              onClick={startVerification}
              variant="outline"
              className="w-full h-11"
            >
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Success */}
        {verificationResult && verificationResult.success && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Verifikasi Berhasil!
              </h3>
              <p className="text-green-700 mb-6">
                {verificationResult.message}
              </p>
              <div className="inline-block bg-white rounded-lg px-4 py-2 border border-green-200">
                <p className="text-xs text-gray-500 mb-1">Waktu Verifikasi</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(verificationResult.timestamp).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 h-11"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          
          <Button
            onClick={() => onNext()}
            disabled={!verificationResult || !verificationResult.success}
            className="flex-1 h-11 bg-[#E0413D] hover:bg-[#C73632] disabled:bg-gray-300"
          >
            Lanjutkan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
