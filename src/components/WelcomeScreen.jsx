import { useState, useRef } from 'react';
import { ArrowRight, Shield, CheckCircle2, Clock, FileText, Camera, UserCheck, PenTool, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

export function WelcomeScreen({ onNext }) {
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleAcceptTerms = () => {
    setShowTermsDialog(false);
    onNext();
  };

  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scroll
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="section-container py-12 space-y-20">
      {/* Process Steps - FIRST */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Langkah Pembukaan Rekening</h2>
        </div>
        
        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex items-start justify-start gap-6 mx-auto overflow-x-auto pb-4 hide-scrollbar scroll-smooth cursor-grab"
          style={{ maxWidth: '72rem' }}
        >
          {/* Step 1 */}
          <div className="flex items-center gap-4 min-w-fit px-3">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: '#E0413D' }}
            >
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Upload e-KTP</h3>
              <p className="text-sm text-gray-600">Foto e-KTP Anda dengan jelas</p>
            </div>
          </div>
          
          {/* Arrow 1 */}
          <div className="flex items-center pt-4 px-3">
            <ArrowRight className="w-7 h-7 text-gray-300 flex-shrink-0" />
          </div>
          
          {/* Step 2 */}
          <div className="flex items-center gap-4 min-w-fit px-3">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: '#E0413D' }}
            >
              <Camera className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Selfie Verification</h3>
              <p className="text-sm text-gray-600">Ambil foto selfie untuk verifikasi</p>
            </div>
          </div>
          
          {/* Arrow 2 */}
          <div className="flex items-center pt-4 px-3">
            <ArrowRight className="w-7 h-7 text-gray-300 flex-shrink-0" />
          </div>
          
          {/* Step 3 */}
          <div className="flex items-center gap-4 min-w-fit px-3">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: '#E0413D' }}
            >
              <UserCheck className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Verifikasi Data</h3>
              <p className="text-sm text-gray-600">Sistem memverifikasi data Anda</p>
            </div>
          </div>
          
          {/* Arrow 3 */}
          <div className="flex items-center pt-4 px-3">
            <ArrowRight className="w-7 h-7 text-gray-300 flex-shrink-0" />
          </div>
          
          {/* Step 4 */}
          <div className="flex items-center gap-4 min-w-fit px-3">
            <div 
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: '#E0413D' }}
            >
              <PenTool className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Tanda Tangan</h3>
              <p className="text-sm text-gray-600">Tanda tangan digital Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements - SECOND */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Yang Anda Perlukan:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">e-KTP Asli</p>
              <p className="text-sm text-gray-600">Pastikan masa berlaku masih valid</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Smartphone dengan Kamera</p>
              <p className="text-sm text-gray-600">Untuk foto KTP dan selfie</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Koneksi Internet Stabil</p>
              <p className="text-sm text-gray-600">Untuk proses verifikasi online</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Waktu 5-10 Menit</p>
              <p className="text-sm text-gray-600">Untuk menyelesaikan proses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - THIRD */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Buka Rekening Tanpa Ribet
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Proses pembukaan rekening 100% digital. Cukup 5 menit dari rumah, rekening Anda siap digunakan.
          </p>
          
          <div className="pt-4">
            <Button
              onClick={() => setShowTermsDialog(true)}
              size="lg"
              className="bg-[#E0413D] hover:bg-[#C73632] text-white h-12 px-8 shadow-sm font-semibold"
              style={{ 
                backgroundColor: '#E0413D',
                color: 'white'
              }}
            >
              Mulai Pembukaan Rekening
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Gratis biaya admin</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Proses 5 menit</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E0413D]/10 to-blue-500/10 rounded-3xl"></div>
            <div className="relative bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
              <div className="space-y-6">
                {/* Mock Phone Interface */}
                <div className="aspect-[9/16] max-w-[280px] mx-auto bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[1.8rem] overflow-hidden">
                    <div className="h-full flex flex-col">
                      {/* Status Bar */}
                      <div className="h-8 bg-gray-50 border-b border-gray-200"></div>
                      
                      {/* Content */}
                      <div className="flex-1 p-6 space-y-4">
                        <div className="h-12 bg-[#E0413D] rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          <div className="aspect-square bg-blue-50 rounded-lg"></div>
                          <div className="aspect-square bg-green-50 rounded-lg"></div>
                          <div className="aspect-square bg-purple-50 rounded-lg"></div>
                          <div className="aspect-square bg-orange-50 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - FOURTH */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Kenapa Pilih CIMB Niaga?</h2>
          <p className="text-lg text-gray-600">Kemudahan dan keamanan untuk Anda</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start justify-center gap-6 max-w-5xl mx-auto">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">100% Online</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tidak perlu datang ke cabang. Semua proses dilakukan secara digital dari rumah.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Proses Cepat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hanya butuh 5-10 menit. Rekening langsung aktif setelah verifikasi selesai.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Aman Terjamin</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dilengkapi enkripsi bank-grade dan verifikasi biometrik untuk keamanan maksimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent 
          className="p-0 gap-0"
          style={{
            maxWidth: 'min(90vw, 42rem)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200" style={{ flexShrink: 0 }}>
            <DialogTitle className="text-2xl font-bold text-gray-900">Syarat dan Ketentuan</DialogTitle>
            <DialogDescription className="text-gray-600">
              Silakan baca dan setujui syarat dan ketentuan pembukaan rekening CIMB Niaga
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className="px-6 py-4 hide-scrollbar" 
            style={{ 
              flex: '1 1 0%', 
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="space-y-6">
              {/* Terms Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Persyaratan Umum</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Warga Negara Indonesia (WNI) yang berusia minimal 17 tahun</li>
                    <li>Memiliki e-KTP yang masih berlaku</li>
                    <li>Memiliki nomor telepon aktif yang terdaftar atas nama sendiri</li>
                    <li>Memiliki alamat email aktif</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Verifikasi Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Data yang Anda berikan akan diverifikasi dengan database Dukcapil</li>
                    <li>Foto selfie akan dibandingkan dengan foto di e-KTP menggunakan teknologi face recognition</li>
                    <li>Proses verifikasi membutuhkan waktu maksimal 1x24 jam</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Keamanan Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Semua data Anda dienkripsi dengan standar keamanan bank</li>
                    <li>Data pribadi Anda dilindungi sesuai UU Perlindungan Data Pribadi</li>
                    <li>CIMB Niaga tidak akan membagikan data Anda kepada pihak ketiga tanpa izin</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4. Kewajiban Nasabah</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Memberikan data yang benar dan akurat</li>
                    <li>Menjaga kerahasiaan PIN, password, dan OTP</li>
                    <li>Melaporkan segera jika terjadi transaksi mencurigakan</li>
                    <li>Memperbarui data jika terjadi perubahan</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5. Biaya dan Layanan</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Pembukaan rekening tidak dikenakan biaya</li>
                    <li>Biaya administrasi dan transaksi sesuai dengan ketentuan yang berlaku</li>
                    <li>CIMB Niaga berhak mengubah biaya dengan pemberitahuan terlebih dahulu</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">6. Persetujuan</h4>
                  <p className="text-sm text-gray-600">
                    Dengan mengklik tombol "Setuju & Lanjutkan", Anda menyatakan telah membaca, memahami, 
                    dan menyetujui seluruh syarat dan ketentuan pembukaan rekening CIMB Niaga.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium text-gray-900 mb-1">Catatan Penting:</p>
                    <p>Pastikan semua data yang Anda berikan adalah benar dan sesuai dengan dokumen resmi. 
                    Kesalahan data dapat menyebabkan proses pembukaan rekening ditolak atau tertunda.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 border-t border-gray-200 gap-3" style={{ flexShrink: 0 }}>
            <Button
              variant="outline"
              onClick={() => setShowTermsDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleAcceptTerms}
              className="bg-[#E0413D] hover:bg-[#C73632] text-white"
              style={{ 
                backgroundColor: '#E0413D',
                color: 'white'
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Setuju & Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}