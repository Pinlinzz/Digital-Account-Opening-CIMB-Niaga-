import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, AlertCircle, CheckCircle2, RefreshCw, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

const mockLivenessCheck = async (selfieData, ktpData) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const random = Math.random();
  
  if (random < 0.05) {
    return {
      success: false,
      livenessScore: 50 + Math.random() * 30,
      error: 'Verifikasi gagal. Pastikan wajah Anda terlihat jelas dan tidak menggunakan foto/video orang lain.',
    };
  }

  return {
    success: true,
    livenessScore: 96 + Math.random() * 3,
    faceMatchScore: 95 + Math.random() * 4,
  };
};

export function SelfieCapture({ onNext, onBack, ktpImage }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [capturedImage]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setCameraError('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageData);
      stopCamera();
      verifyLiveness(imageData);
    }
  };

  const verifyLiveness = async (selfieData) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await mockLivenessCheck(selfieData, ktpImage);
      
      if (result.success) {
        setVerificationResult(result);
      } else {
        setError(result.error);
        setVerificationResult(null);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat verifikasi. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setError(null);
  };

  const handleSubmit = () => {
    onNext({
      selfieImage: capturedImage,
    });
  };

  return (
    <div className="section-container max-w-4xl py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-10 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">Langkah 2 dari 4</span>
            <span>•</span>
            <span>Verifikasi Wajah</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Verifikasi Wajah Anda
          </h2>
          <p className="text-gray-600">
            Ambil foto selfie untuk memastikan Anda adalah pemilik e-KTP yang sah
          </p>
        </div>

        {/* Camera Error */}
        {cameraError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        {/* Camera View */}
        {!capturedImage && !cameraError && (
          <div className="space-y-6">
            <div className="relative aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden border border-gray-200">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Face Oval Guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="w-48 h-64 border-4 border-white rounded-[50%] opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Posisikan wajah di sini
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={capturePhoto}
              className="w-full h-12 bg-[#E0413D] hover:bg-[#C73632] text-base font-semibold"
            >
              <Camera className="w-5 h-5 mr-2" />
              Ambil Foto
            </Button>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-sm">Tips selfie yang baik:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• Pastikan wajah berada di tengah oval</li>
                    <li>• Gunakan pencahayaan yang cukup</li>
                    <li>• Lepas kacamata, topi, atau masker</li>
                    <li>• Pastikan ekspresi wajah natural</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Captured Image */}
        {capturedImage && (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img
                src={capturedImage}
                alt="Selfie"
                className="w-full h-auto"
              />
            </div>

            {/* Processing */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Memverifikasi Wajah
                </h3>
                <p className="text-sm text-gray-600">
                  Melakukan deteksi keaslian dan pencocokan dengan e-KTP...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {verificationResult && verificationResult.success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-2">
                      Verifikasi Berhasil
                    </p>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>• Skor Keaslian: {verificationResult.livenessScore.toFixed(1)}%</p>
                      <p>• Kesesuaian Wajah: {verificationResult.faceMatchScore.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isProcessing && (
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="w-full h-11"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ambil Foto Ulang
              </Button>
            )}
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
            onClick={handleSubmit}
            disabled={!verificationResult || !verificationResult.success}
            className="flex-1 h-11 bg-[#E0413D] hover:bg-[#C73632] disabled:bg-gray-300"
          >
            Lanjutkan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
