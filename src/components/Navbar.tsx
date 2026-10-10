import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

const ContactButtons = memo(() => (
  <div className="container mx-auto px-4 sm:px-6 flex flex-row justify-center sm:justify-end items-center space-x-4 sm:space-x-6">
    {['+380971350010', '+380991350010'].map((phone) => (
      <a
        key={phone}
        href={`tel:${phone}`}
        className="flex items-center hover:text-accent-300 transition-colors text-sm sm:text-base font-bold group bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg hover:bg-white/20"
      >
        <div className="bg-accent-500 rounded-full p-1 mr-2 group-hover:scale-110 transition-transform">
          <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
        <span className="tracking-wide">{phone.slice(3, 6)}-{phone.slice(6, 9)}-{phone.slice(9)}</span>
      </a>
    ))}
  </div>
));

ContactButtons.displayName = 'ContactButtons';

const NavLinks = memo(({ onClose, isMobile }: { onClose?: () => void; isMobile?: boolean }) => {
  const { content } = useLanguage();
  const location = useLocation();

  const scrollToSection = useCallback((sectionId: string) => {
    onClose?.();
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, [location.pathname, onClose]);

  const linkClass = isMobile
    ? "text-xl font-semibold whitespace-nowrap text-white hover:text-accent-300 transition-colors py-2 text-left"
    : "text-lg font-semibold whitespace-nowrap bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent hover:from-accent-300 hover:to-accent-400 transition-all duration-300";

  return (
    <>
      <button onClick={() => scrollToSection('services')} className={linkClass}>{content.nav.services}</button>
      <button onClick={() => scrollToSection('prices')} className={linkClass}>{content.nav.prices}</button>
      <Link to="/about" className={linkClass} onClick={onClose}>{content.nav.about}</Link>
      <Link to="/faq" className={linkClass} onClick={onClose}>{content.nav.faq}</Link>
      <Link to="/contact" className={linkClass} onClick={onClose}>{content.nav.contacts}</Link>
    </>
  );
});

NavLinks.displayName = 'NavLinks';

const LanguageButton = memo(() => {
  const { content, toggleLanguage } = useLanguage();
  return (
    <button onClick={toggleLanguage}
      className="hover:text-accent-300 transition-colors border border-white/30 px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-white/10 text-white">
      {content.nav.language}
    </button>
  );
});

LanguageButton.displayName = 'LanguageButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <>
      <div className="bg-primary-900/80 backdrop-blur-md text-white py-1.5 shadow-md relative z-30">
        <ContactButtons />
      </div>

      <nav className="relative container mx-auto px-4 sm:px-6 py-2.5 z-20">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
            <Logo className="h-[138px] md:h-[193px] w-auto text-blue-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
            <div className="flex flex-col leading-none text-center sm:text-left">
              <span className="text-white font-extrabold text-xl sm:text-2xl tracking-wide drop-shadow-md">VODOPOVERKA</span>
              <span className="text-accent-300 text-xs sm:text-sm font-medium mt-1 drop-shadow-md">
                Повірка лічильників води
              </span>
            </div>
          </Link>

          <div className="md:hidden absolute top-1/2 right-16 -translate-y-1/2 z-50">
            <LanguageButton />
          </div>
          <button onClick={toggleMenu} className="md:hidden absolute top-1/2 right-4 -translate-y-1/2 z-50 p-2.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-white backdrop-blur-sm" aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>

          <div className="hidden md:flex items-center space-x-5 lg:space-x-7 text-white">
            <NavLinks />
            <LanguageButton />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-primary-900/95 backdrop-blur-lg shadow-2xl py-6 px-6 z-50 animate-fade-in border-t border-white/10">
            <div className="flex flex-col items-start space-y-2 text-white">
              <NavLinks onClose={closeMenu} isMobile={true} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default memo(Navbar);
