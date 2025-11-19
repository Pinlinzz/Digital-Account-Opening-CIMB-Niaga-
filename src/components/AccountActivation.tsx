import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, CreditCard, Download, Share2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import type { CustomerData } from '../App';

interface AccountActivationProps {
  customerData: CustomerData;
}

// Mock Core Banking Integration
const mockAccountActivation = async (customerData: CustomerData): Promise<{
  success: boolean;
  accountNumber: string;
  accountType: string;
  status: string;
  openingDate: string;
}> => {
  // Simulate core banking processing
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Generate account number
  const accountNumber = '1234567' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');

  return {
    success: true,
    accountNumber,
    accountType: 'TABUNGAN',
    status: 'ACTIVE',
    openingDate: new Date().toLocaleDateString('id-ID'),
  };
};

export function AccountActivation({ customerData }: AccountActivationProps) {
  const [isActivating, setIsActivating] = useState(true);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    activateAccount();
  }, []);

  const activateAccount = async () => {
    setIsActivating(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 400);

    try {
      const result = await mockAccountActivation(customerData);
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setAccountInfo(result);
        setIsActivating(false);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsActivating(false);
    }
  };

  const handleDownloadStatement = () => {
    alert('Fitur download e-statement akan segera tersedia');
  };

  const handleShareAccount = () => {
    alert('Fitur share nomor rekening akan segera tersedia');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {isActivating ? (
        <Card className="shadow-xl border-0">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Mengaktifkan Rekening Anda</h3>
                <p className="text-gray-600">Mohon tunggu sebentar...</p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Memproses data nasabah</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Membuat nomor rekening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress >= 90 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    )}
                    <span className="text-gray-700">Integrasi dengan core banking</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-3xl font-bold text-green-900">
                      Selamat!
                    </h2>
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-xl text-green-800">
                    Rekening Anda Telah Aktif
                  </p>
                  <p className="text-gray-700">
                    Pembukaan rekening berhasil dilakukan. Anda sekarang dapat mulai bertransaksi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Informasi Rekening</CardTitle>
                  <CardDescription>Detail rekening baru Anda</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="space-y-4">
                  <div>
                    <p className="text-blue-100 text-sm">Nomor Rekening</p>
                    <p className="text-2xl font-mono tracking-wider">
                      {accountInfo?.accountNumber}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400">
                    <div>
                      <p className="text-blue-100 text-sm">Nama Pemilik</p>
                      <p className="font-semibold">{customerData.nama}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Jenis Rekening</p>
                      <p className="font-semibold">{accountInfo?.accountType}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="font-semibold text-green-700">{accountInfo?.status}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Tanggal Pembukaan</p>
                  <p className="font-semibold mt-1">{accountInfo?.openingDate}</p>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-sm">
                  <strong>Info:</strong> Kartu ATM dan buku tabungan Anda akan dikirim ke alamat 
                  yang terdaftar dalam waktu 3-5 hari kerja.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleDownloadStatement} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Info
                </Button>
                <Button variant="outline" onClick={handleShareAccount} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-3">Langkah Selanjutnya:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Download aplikasi mobile banking untuk kemudahan transaksi</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Aktifkan notifikasi transaksi untuk keamanan rekening Anda</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Lakukan setoran awal minimal Rp 50.000 untuk mengaktifkan semua fitur</p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12" size="lg">
                Buka Aplikasi Mobile Banking
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
