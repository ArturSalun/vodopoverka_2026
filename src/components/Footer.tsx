import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Instagram, GitBranch as BrandTelegram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SerrpChecker from './SerrpChecker';

const ContactInfo = memo(() => (
  <div className="space-y-3">
    {[
      { href: 'tel:+380971350010', number: '097-135-00-10' },
      { href: 'tel:+380991350010', number: '099-135-00-10' }
    ].map(({ href, number }) => (
      <p key={number} className="flex items-center text-gray-300">
        <Phone className="w-5 h-5 mr-2 text-accent-400" />
        <a href={href} className="hover:text-accent-300 transition-colors">{number}</a>
      </p>
    ))}
    <p className="flex items-center text-gray-300">
      <Mail className="w-5 h-5 mr-2 text-accent-400" />
      <a href="mailto:vodopoverka@gmail.com" className="hover:text-accent-300 transition-colors">vodopoverka@gmail.com</a>
    </p>
  </div>
));

ContactInfo.displayName = 'ContactInfo';

const WorkHours = memo(() => (
  <div className="space-y-3">
    {[
      { time: 'Пн–Пт: 9:00 – 18:00' },
      { time: 'Сб: 10:00 – 15:00' }
    ].map(({ time }) => (
      <p key={time} className="flex items-center text-gray-300">
        <Clock className="w-5 h-5 mr-2 text-accent-400" />
        {time}
      </p>
    ))}
  </div>
));

WorkHours.displayName = 'WorkHours';

const SocialLinks = memo(() => (
  <div className="mt-4 space-y-3">
    {[
      { icon: <Instagram className="w-5 h-5 mr-2" />, href: 'https://www.instagram.com/vodopoverka', label: '@vodopoverka' },
      { icon: <BrandTelegram className="w-5 h-5 mr-2" />, href: 'https://t.me/vodopover', label: '@vodopover' }
    ].map(({ icon, href, label }) => (
      <p key={label} className="flex items-center text-gray-300">
        {icon}
        <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">{label}</a>
      </p>
    ))}
  </div>
));

SocialLinks.displayName = 'SocialLinks';

const Footer = () => {
  const { content, language } = useLanguage();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{content.footer.contacts}</h3>
            <ContactInfo />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{content.footer.workHours}</h3>
            <WorkHours />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{content.footer.address}</h3>
            <p className="flex items-start text-gray-300">
              <MapPin className="w-5 h-5 mr-2 text-accent-400 flex-shrink-0 mt-0.5" />
              {language === 'ru' ? 'ул. Нетеченская наб. 14, оф. 300, г. Харьков' : 'вул. Нетеченська наб. 14, оф. 300, м. Харків'}
            </p>
            <SocialLinks />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === 'ru' ? 'Навигация' : 'Навігація'}
            </h3>
            <ul className="space-y-2">
              {[
                { path: '/#services', label: content.footer.links.services },
                { path: '/#prices', label: content.footer.links.prices },
                { path: '/about', label: content.footer.links.about },
                { path: '/faq', label: content.footer.links.faq },
                { path: '/contact', label: content.footer.links.contacts }
              ].map(({ path, label }) => (
                <li key={path}>
                  <button onClick={() => handleNavigation(path)} className="text-gray-300 hover:text-accent-300 transition-colors">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <SerrpChecker className="bg-gray-800" />
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>{content.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
