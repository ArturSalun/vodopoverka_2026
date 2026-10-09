import Navbar from './Navbar';
import { useLanguage } from '../context/LanguageContext';

interface PageHeroProps {
  title: string;
  subtitle: string;
}

const PageHero = ({ title, subtitle }: PageHeroProps) => {
  const { language } = useLanguage();
  const heroImage = "https://poverka.net.ua/wp-content/uploads/2021/09/poster-poverka-ukraina.jpg";

  return (
    <div className="relative text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={language === 'ru' ? 'Лічильники води — повірка у Харкові' : 'Лічильники води — повірка у Харкові'}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-blue-950/40"></div>
      <div className="absolute inset-0 bg-water-pattern"></div>

      <Navbar />

      <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight text-shadow-lg animate-fade-in-up max-w-4xl">
          {title}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed max-w-3xl animate-fade-in-up text-center" style={{ animationDelay: '0.1s' }}>
          {subtitle}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0,30 C320,55 640,5 960,20 C1200,35 1320,25 1440,15 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </div>
  );
};

export default PageHero;
