import { useState, useRef, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle, Loader2, X, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

// Mock Liveness Detection & Face Matching
const mockLivenessCheck = async (selfieData, ktpData) => {
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
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin akses kamera.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    stopCamera();

    // Process liveness detection
    processLiveness(imageData);
  };

  const processLiveness = async (imageData) => {
    setIsProcessing(true);
    setError(null);

    const result = await mockLivenessCheck(imageData, ktpImage);
    setIsProcessing(false);

    if (result.success) {
      setVerificationResult(result);
    } else {
      setError(result.error || 'Gagal memverifikasi wajah');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setError(null);
    startCamera();
  };

  const handleContinue = () => {
    if (verificationResult?.success) {
      stopCamera();
      onNext({
        selfieImage: capturedImage || undefined,
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
          {!capturedImage ? (
            <div className="space-y-4">
              {cameraError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto rounded-lg mirror-video"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    
                    {/* Face guide overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-80 border-4 border-white rounded-full opacity-50"></div>
                    </div>

                    {/* Capture button overlay */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                      <Button
                        onClick={capturePhoto}
                        size="lg"
                        className="rounded-full w-16 h-16 p-0"
                      >
                        <Camera className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />
                </>
              )}

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Panduan Selfie:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Pastikan wajah Anda berada di dalam lingkaran panduan</li>
                    <li>Pastikan wajah terlihat jelas dan menghadap kamera</li>
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
                  src={capturedImage} 
                  alt="Selfie preview" 
                  className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-200"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRetake}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
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

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
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
