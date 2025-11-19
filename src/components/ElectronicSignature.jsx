import { useState, useRef, useEffect } from 'react';
import { PenTool, Eraser, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ElectronicSignature({ customerData, onNext, onBack }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    
    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    if (hasSignature && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setSignatureData(dataUrl);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureData(null);
  };

  const handleContinue = () => {
    if (signatureData && agreedToTerms) {
      onNext({ signature: signatureData });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <PenTool className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle>Tanda Tangan Elektronik</CardTitle>
              <CardDescription>
                Tanda tangani perjanjian pembukaan rekening secara elektronik
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="agreement" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="agreement">Perjanjian</TabsTrigger>
              <TabsTrigger value="signature">Tanda Tangan</TabsTrigger>
            </TabsList>

            <TabsContent value="agreement" className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto space-y-4 border">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Perjanjian Pembukaan Rekening</h3>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <p className="font-semibold">SYARAT DAN KETENTUAN PEMBUKAAN REKENING</p>
                  
                  <p>Dengan ini saya, <strong>{customerData.nama}</strong> (NIK: {customerData.nik}), menyatakan:</p>

                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Bahwa data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.</li>
                    <li>Saya setuju untuk membuka rekening tabungan di Bank XYZ.</li>
                    <li>Saya telah membaca dan memahami seluruh syarat dan ketentuan yang berlaku.</li>
                    <li>Saya memberikan persetujuan kepada Bank XYZ untuk memverifikasi data saya ke instansi terkait.</li>
                    <li>Saya setuju bahwa tanda tangan elektronik yang saya berikan memiliki kekuatan hukum yang sama dengan tanda tangan basah.</li>
                    <li>Rekening saya akan digunakan untuk keperluan yang sah sesuai peraturan perundang-undangan.</li>
                    <li>Saya bersedia mematuhi peraturan Anti Pencucian Uang dan Pencegahan Pendanaan Terorisme (APU-PPT).</li>
                    <li>Saya bertanggung jawab penuh atas penggunaan rekening dan akan segera melaporkan jika terjadi transaksi mencurigakan.</li>
                  </ol>

                  <p className="pt-4 border-t mt-4">
                    <strong>Ketentuan Biaya:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Biaya administrasi: Rp 10.000/bulan</li>
                    <li>Saldo minimal: Rp 50.000</li>
                    <li>Gratis biaya transfer antar rekening internal</li>
                  </ul>

                  <p className="pt-4 border-t mt-4">
                    <strong>Perlindungan Data Pribadi:</strong>
                  </p>
                  <p className="text-xs">
                    Bank XYZ berkomitmen melindungi data pribadi Anda sesuai dengan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi. 
                    Data Anda akan digunakan hanya untuk keperluan perbankan dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agree-terms" className="text-sm text-blue-900 cursor-pointer">
                  Saya telah membaca dan menyetujui seluruh syarat dan ketentuan pembukaan rekening di atas
                </label>
              </div>
            </TabsContent>

            <TabsContent value="signature" className="space-y-4">
              <div className="space-y-4">
                <Alert className="bg-purple-50 border-purple-200">
                  <PenTool className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    Bubuhkan tanda tangan Anda pada kotak di bawah ini. Tanda tangan elektronik ini memiliki 
                    kekuatan hukum yang sama dengan tanda tangan konvensional sesuai UU ITE.
                  </AlertDescription>
                </Alert>

                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Tanda Tangan:
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      disabled={!hasSignature}
                    >
                      <Eraser className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>

                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded cursor-crosshair bg-white touch-none"
                    style={{ touchAction: 'none' }}
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    * Tanda tangan di dalam kotak putih di atas
                  </p>
                </div>

                {hasSignature && agreedToTerms && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Tanda tangan berhasil dibuat dan akan disimpan secara terenkripsi
                    </AlertDescription>
                  </Alert>
                )}

                {!agreedToTerms && hasSignature && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Anda harus menyetujui syarat dan ketentuan terlebih dahulu di tab "Perjanjian"
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">Informasi Penandatanganan:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Nama:</span>
                      <p>{customerData.nama}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">NIK:</span>
                      <p className="font-mono">{customerData.nik}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Waktu:</span>
                      <p>{new Date().toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Kembali
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!hasSignature || !agreedToTerms}
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
