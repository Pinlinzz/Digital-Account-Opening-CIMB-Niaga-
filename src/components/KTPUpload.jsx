import { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle2, Edit2, ArrowRight, ArrowLeft, Camera, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

const mockOCR = async (imageData) => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  const random = Math.random();
  
  if (random < 0.95) {
    return {
      success: true,
      confidence: 96 + Math.random() * 3,
      data: {
        nik: '3174' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'),
        nama: 'CONTOH NASABAH BARU',
        tanggalLahir: '15-08-1990',
        alamat: 'JL. SUDIRMAN NO. 123, JAKARTA SELATAN',
      },
    };
  } else {
    return {
      success: false,
      confidence: 0,
      error: 'Gambar terlalu blur atau kurang jelas. Silakan foto ulang dengan pencahayaan yang baik.',
    };
  }
};

export function KTPUpload({ onNext, onBack }) {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    nik: '',
    nama: '',
    tanggalLahir: '',
    alamat: '',
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result;
      setImage(imageData);
      setError(null);
      setOcrResult(null);

      setIsProcessing(true);
      try {
        const result = await mockOCR(imageData);
        
        if (result.success) {
          setOcrResult(result);
          setEditedData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memproses gambar. Silakan coba lagi.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onNext({
      ...editedData,
      ktpImage: image,
    });
  };

  return (
    <div className="section-container max-w-4xl py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-10 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">Langkah 1 dari 4</span>
            <span>•</span>
            <span>Upload e-KTP</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Upload Foto e-KTP
          </h2>
          <p className="text-gray-600">
            Pastikan foto e-KTP jelas, tidak blur, dan semua informasi dapat terbaca
          </p>
        </div>

        {/* Upload Area */}
        {!image && (
          <div className="mb-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#E0413D] hover:bg-red-50/30 transition-all"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#E0413D]/10 rounded-2xl flex items-center justify-center mx-auto transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#E0413D] transition-colors" />
                </div>
                
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    Klik untuk upload atau ambil foto
                  </p>
                  <p className="text-sm text-gray-500">
                    Format JPG atau PNG • Maksimal 5MB
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Image Preview */}
        {image && !isProcessing && (
          <div className="mb-8 space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              <img
                src={image}
                alt="KTP Preview"
                className="w-full h-auto"
              />
            </div>
            {!ocrResult && (
              <Button
                onClick={() => {
                  setImage(null);
                  setOcrResult(null);
                  setError(null);
                }}
                variant="outline"
                className="w-full h-11"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Foto Lain
              </Button>
            )}
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Memproses Foto e-KTP
            </h3>
            <p className="text-sm text-gray-600">
              Sedang mengekstrak data dari foto e-KTP Anda...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OCR Success Result */}
        {ocrResult && ocrResult.success && (
          <div className="space-y-6 mb-8">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 mb-1">
                    Data berhasil terbaca
                  </p>
                  <p className="text-sm text-green-700">
                    Akurasi: {ocrResult.confidence.toFixed(1)}% • Silakan periksa dan koreksi jika diperlukan
                  </p>
                </div>
              </div>
            </div>

            {/* Data Form */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Data e-KTP</h3>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Simpan' : 'Edit'}
                </Button>
              </div>

              <div className="grid gap-5">
                <div>
                  <Label htmlFor="nik" className="mb-2 block">NIK</Label>
                  <Input
                    id="nik"
                    value={editedData.nik}
                    onChange={(e) => setEditedData({ ...editedData, nik: e.target.value })}
                    disabled={!isEditing}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="nama" className="mb-2 block">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={editedData.nama}
                    onChange={(e) => setEditedData({ ...editedData, nama: e.target.value })}
                    disabled={!isEditing}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="tanggalLahir" className="mb-2 block">Tanggal Lahir</Label>
                  <Input
                    id="tanggalLahir"
                    value={editedData.tanggalLahir}
                    onChange={(e) => setEditedData({ ...editedData, tanggalLahir: e.target.value })}
                    disabled={!isEditing}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="alamat" className="mb-2 block">Alamat</Label>
                  <Input
                    id="alamat"
                    value={editedData.alamat}
                    onChange={(e) => setEditedData({ ...editedData, alamat: e.target.value })}
                    disabled={!isEditing}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Retake Option */}
            <Button
              onClick={() => {
                setImage(null);
                setOcrResult(null);
                setError(null);
              }}
              variant="outline"
              className="w-full h-11"
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload Foto Lain
            </Button>
          </div>
        )}

        {/* Tips */}
        {!image && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 text-sm">Tips untuk hasil terbaik:</p>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li>• Foto di tempat dengan pencahayaan yang cukup</li>
                  <li>• Pastikan seluruh bagian e-KTP terlihat jelas</li>
                  <li>• Hindari pantulan cahaya pada kartu</li>
                  <li>• Foto tidak blur atau terpotong</li>
                </ul>
              </div>
            </div>
          </div>
        )}

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
            disabled={!ocrResult || !ocrResult.success}
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
