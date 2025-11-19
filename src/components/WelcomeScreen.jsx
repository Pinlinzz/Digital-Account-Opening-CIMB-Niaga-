import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function WelcomeScreen({ onNext }) {
  const features = [
    {
      icon: Clock,
      title: 'Cepat & Mudah',
      description: 'Proses pembukaan rekening hanya 5-10 menit',
    },
    {
      icon: Shield,
      title: 'Aman & Terverifikasi',
      description: 'Verifikasi terintegrasi dengan Dukcapil',
    },
    {
      icon: CheckCircle,
      title: 'Langsung Aktif',
      description: 'Rekening aktif setelah verifikasi selesai',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl">
            Pembukaan Rekening Digital
          </CardTitle>
          <CardDescription className="text-lg">
            Buka rekening bank Anda secara online dengan mudah, cepat, dan aman
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="mx-auto w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 space-y-3">
            <h4 className="font-semibold text-blue-900">Yang Anda Perlukan:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>e-KTP asli yang masih berlaku</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Kamera untuk foto e-KTP dan selfie</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Koneksi internet yang stabil</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={onNext} 
            className="w-full h-12 text-lg"
            size="lg"
          >
            Mulai Pembukaan Rekening
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-xs text-center text-gray-500">
            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan pembukaan rekening
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
