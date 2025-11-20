import { Shield, Phone } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#E0413D"/>
              <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20Z" fill="white" fillOpacity="0.2"/>
              <path d="M16 20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20C24 22.2091 22.2091 24 20 24C17.7909 24 16 22.2091 16 20Z" fill="white"/>
            </svg>
            <div>
              <div className="text-xl font-bold text-gray-900 tracking-tight">CIMB Niaga</div>
              <div className="text-xs text-gray-500 -mt-0.5">Digital Account Opening</div>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-6">
            <a href="tel:14041" className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 hover:text-[#E0413D] transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-medium">14041</span>
            </a>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline font-medium">Secured Connection</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
