import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src="./public/images/MBlogo1.png" 
            alt="logo"
            className="h-8 w-auto sm:h-9" 
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 md:flex lg:gap-8">
          {['Products', 'Contact'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900 lg:text-base"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          <button 
            aria-label="Search" 
            className="rounded-md p-2 transition-colors hover:bg-neutral-100 hover:opacity-80"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            aria-label="Search" 
            className="rounded-md p-2 transition-colors hover:bg-neutral-100"
          >
            <Search className="h-5 w-5" />
          </button>
          <button 
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
            className="rounded-md p-2 transition-colors hover:bg-neutral-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-neutral-200/70 bg-white/95 backdrop-blur md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-4">
              {['Products', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-base font-medium text-neutral-700 transition-colors hover:text-neutral-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
            
            {/* Mobile Action Buttons */}
            <div className="mt-6 flex items-center gap-4 border-t border-neutral-200/50 pt-4">
              <button 
                aria-label="User account" 
                className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <User className="h-4 w-4" />
                Account
              </button>
              <button 
                aria-label="Shopping bag" 
                className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}