import { useState, useRef, useEffect } from 'react';
import { PenTool, Eraser, CheckCircle2, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Button } from './ui/button';

export function ElectronicSignature({ customerData, onNext, onBack }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    onNext({ signature: signatureData });
  };

  return (
    <div className="section-container max-w-4xl py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-10 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">Langkah 4 dari 4</span>
            <span>•</span>
            <span>Tanda Tangan Digital</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Tanda Tangan Digital
          </h2>
          <p className="text-gray-600">
            Buat tanda tangan elektronik untuk menyelesaikan pembukaan rekening
          </p>
        </div>

        {/* Agreement */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Pernyataan Persetujuan</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Saya, <strong className="text-gray-900">{customerData.nama}</strong> dengan NIK <strong className="text-gray-900">{customerData.nik}</strong>, 
              dengan ini menyatakan:
            </p>
            <ul className="space-y-2 ml-5 list-disc">
              <li>Data yang saya berikan adalah benar dan dapat dipertanggungjawabkan</li>
              <li>Saya menyetujui syarat dan ketentuan pembukaan rekening CIMB Niaga</li>
              <li>Tanda tangan digital ini memiliki kekuatan hukum yang sah</li>
              <li>Saya memberikan persetujuan pemrosesan data pribadi sesuai peraturan yang berlaku</li>
            </ul>
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="space-y-4 mb-8">
          <div className="border-2 border-gray-300 rounded-xl bg-white overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-300 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <PenTool className="w-4 h-4" />
                <span className="font-medium">Tanda tangan di sini</span>
              </div>
              <Button
                onClick={clearSignature}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-[#E0413D] h-8"
              >
                <Eraser className="w-4 h-4 mr-1.5" />
                Hapus
              </Button>
            </div>
            
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-64 cursor-crosshair touch-none bg-white"
              style={{ touchAction: 'none' }}
            />
          </div>

          {hasSignature && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800">
                  Tanda tangan berhasil dibuat. Klik "Hapus" jika ingin membuat ulang.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 text-sm">Tips tanda tangan digital:</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Gunakan mouse atau jari untuk menggambar tanda tangan</li>
                <li>• Pastikan tanda tangan jelas dan tidak terlalu kecil</li>
                <li>• Gunakan tanda tangan yang sama seperti di dokumen resmi Anda</li>
                <li>• Tanda tangan ini akan digunakan untuk dokumen rekening Anda</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
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
            disabled={!hasSignature}
            className="flex-1 h-11 bg-[#E0413D] hover:bg-[#C73632] disabled:bg-gray-300"
          >
            Selesai & Aktivasi Rekening
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
