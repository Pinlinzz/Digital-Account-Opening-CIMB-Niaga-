import { useEffect, useState } from 'react';
import { CheckCircle2, Download, Mail, Phone, Home, Smartphone, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const mockAccountActivation = async (customerData) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const accountNumber = '8' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  
  return {
    success: true,
    accountNumber,
    accountType: 'CIMB Niaga Xtra Savings',
    activationDate: new Date().toISOString(),
  };
};

export function AccountActivation({ customerData }) {
  const [isActivating, setIsActivating] = useState(true);
  const [activationResult, setActivationResult] = useState(null);

  useEffect(() => {
    const activateAccount = async () => {
      const result = await mockAccountActivation(customerData);
      setActivationResult(result);
      setIsActivating(false);
    };
    
    activateAccount();
  }, [customerData]);

  if (isActivating) {
    return (
      <div className="section-container max-w-4xl py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-12 md:p-16 shadow-sm text-center">
          <div className="w-16 h-16 border-4 border-[#E0413D] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mengaktifkan Rekening
          </h2>
          <p className="text-gray-600 mb-8">
            Mohon tunggu, kami sedang memproses aktivasi rekening Anda
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-[#E0413D] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#E0413D] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-[#E0413D] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!activationResult || !activationResult.success) {
    return (
      <div className="section-container max-w-4xl py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aktivasi Gagal
          </h2>
          <p className="text-gray-600 mb-6">
            Terjadi kesalahan saat mengaktifkan rekening. Silakan hubungi customer service kami.
          </p>
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Hubungi Customer Service
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container max-w-5xl py-8 space-y-8">
      {/* Success Message */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 shadow-sm text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Selamat! Rekening Anda Aktif
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pembukaan rekening berhasil. Anda sekarang dapat menikmati layanan perbankan digital CIMB Niaga
        </p>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Rekening</h2>
        
        <div className="space-y-6">
          {/* Account Number Card */}
          <div className="bg-gradient-to-br from-[#E0413D] to-[#C73632] rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm mb-2">Nomor Rekening</p>
            <p className="text-3xl font-bold tracking-wider font-mono">
              {activationResult.accountNumber}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Nama Pemegang Rekening</p>
              <p className="font-semibold text-gray-900">{customerData.nama}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Jenis Rekening</p>
              <p className="font-semibold text-gray-900">{activationResult.accountType}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">NIK</p>
              <p className="font-semibold text-gray-900">{customerData.nik}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Tanggal Aktivasi</p>
              <p className="font-semibold text-gray-900">
                {new Date(activationResult.activationDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Langkah Selanjutnya</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Cek Email Anda</h3>
              <p className="text-sm text-gray-600">
                Detail rekening dan panduan aktivasi telah dikirim ke email Anda
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Download Aplikasi Octo Mobile</h3>
              <p className="text-sm text-gray-600">
                Kelola rekening Anda kapan saja dan di mana saja dengan aplikasi mobile banking
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Setoran Awal</h3>
              <p className="text-sm text-gray-600">
                Lakukan setoran awal minimal Rp 500.000 untuk mengaktifkan semua fitur rekening
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Mobile Banking</h3>
          <p className="text-sm text-gray-600">
            Akses 24/7 via Octo Mobile
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Kartu Debit Gratis</h3>
          <p className="text-sm text-gray-600">
            Akan dikirim ke alamat Anda
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Laporan Bulanan</h3>
          <p className="text-sm text-gray-600">
            Terima via email gratis
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4">
          <Button className="h-11 bg-[#E0413D] hover:bg-[#C73632]">
            <Download className="w-4 h-4 mr-2" />
            Download Laporan PDF
          </Button>
          
          <Button variant="outline" className="h-11">
            <Mail className="w-4 h-4 mr-2" />
            Kirim ke Email
          </Button>
          
          <Button variant="outline" className="h-11">
            <Phone className="w-4 h-4 mr-2" />
            Hubungi CS: 14041
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <Button
          onClick={() => window.location.reload()}
          variant="ghost"
          className="text-[#E0413D] hover:text-[#C73632] hover:bg-red-50"
        >
          <Home className="w-4 h-4 mr-2" />
          Kembali ke Halaman Utama
        </Button>
      </div>
    </div>
  );
}
