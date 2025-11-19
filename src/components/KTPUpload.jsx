import { useState, useRef } from 'react';
import { Camera, AlertCircle, CheckCircle, Loader2, X, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Mock OCR function - simulates OCR processing
const mockOCR = async (imageData) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate 95% success rate
  const random = Math.random();
  
  if (random < 0.95) {
    return {
      success: true,
      confidence: 96 + Math.random() * 3, // 96-99%
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
      error: 'Gambar terlalu blur atau pencahayaan kurang baik. Silakan foto ulang.',
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result;
      setImage(imageData);
      setError(null);
      setOcrResult(null);
      setIsEditing(false);

      // Process OCR
      setIsProcessing(true);
      const result = await mockOCR(imageData);
      setIsProcessing(false);

      if (result.success) {
        setOcrResult(result);
        setEditedData(result.data);
      } else {
        setError(result.error || 'Gagal memproses gambar');
        setImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setImage(null);
    setOcrResult(null);
    setError(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(ocrResult.data);
  };

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const handleSaveEdit = () => {
    setOcrResult({
      ...ocrResult,
      data: editedData,
    });
    setIsEditing(false);
  };

  const handleContinue = () => {
    if (ocrResult?.data) {
      onNext({
        nik: editedData.nik,
        nama: editedData.nama,
        tanggalLahir: editedData.tanggalLahir,
        alamat: editedData.alamat,
        ktpImage: image || undefined,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle>Upload Foto e-KTP</CardTitle>
          <CardDescription>
            Pastikan foto e-KTP Anda jelas dan tidak blur. Semua teks harus terbaca dengan baik.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!image ? (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Klik untuk ambil atau upload foto e-KTP</p>
                <p className="text-sm text-gray-500">Format: JPG, PNG (Max: 5MB)</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Tips:</strong> Pastikan pencahayaan cukup terang, tidak ada pantulan cahaya, 
                  dan semua sudut e-KTP terlihat jelas.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={image} 
                  alt="e-KTP preview" 
                  className="w-full rounded-lg border-2 border-gray-200"
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
                    Memproses e-KTP Anda dengan teknologi OCR...
                  </AlertDescription>
                </Alert>
              )}

              {ocrResult && ocrResult.success && (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      e-KTP berhasil diproses dengan akurasi {ocrResult.confidence.toFixed(1)}%
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Data Terdeteksi:</h4>
                      {!isEditing && (
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Data
                        </Button>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">NIK:</span>
                          <p className="font-mono">{editedData.nik}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Nama:</span>
                          <p>{editedData.nama}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Tanggal Lahir:</span>
                          <p>{editedData.tanggalLahir}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Alamat:</span>
                          <p>{editedData.alamat}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800 text-sm">
                            Silakan koreksi data jika ada yang tidak sesuai dengan e-KTP Anda
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                              id="nik"
                              value={editedData.nik}
                              onChange={(e) => handleInputChange('nik', e.target.value)}
                              placeholder="Nomor Induk Kependudukan"
                              maxLength={16}
                            />
                          </div>

                          <div>
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input
                              id="nama"
                              value={editedData.nama}
                              onChange={(e) => handleInputChange('nama', e.target.value)}
                              placeholder="Nama sesuai KTP"
                            />
                          </div>

                          <div>
                            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                            <Input
                              id="tanggalLahir"
                              value={editedData.tanggalLahir}
                              onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                              placeholder="DD-MM-YYYY"
                            />
                          </div>

                          <div>
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input
                              id="alamat"
                              value={editedData.alamat}
                              onChange={(e) => handleInputChange('alamat', e.target.value)}
                              placeholder="Alamat sesuai KTP"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                            Batal
                          </Button>
                          <Button onClick={handleSaveEdit} className="flex-1">
                            Simpan Data
                          </Button>
                        </div>
                      </div>
                    )}
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

          {!isEditing && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Kembali
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!ocrResult || isProcessing}
                className="flex-1"
              >
                Lanjutkan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
