import cimbLogo from 'figma:asset/6bce46cd9dac8c7e1157de2411ae8b72329ec56d.png';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={cimbLogo} 
              alt="CIMB Niaga" 
              className="h-8 md:h-10 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">
              Pembukaan Rekening Digital
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
