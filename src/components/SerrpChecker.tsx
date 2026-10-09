import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SerrpCheckerProps {
  className?: string;
}

const SerrpChecker: React.FC<SerrpCheckerProps> = ({ className = "" }) => {
  const { language } = useLanguage();
  const [meterNumber, setMeterNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meterNumber.trim()) {
      const url = `https://serrp.info/search_multi?search_text=${encodeURIComponent(meterNumber.trim())}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`p-6 rounded-lg ${className}`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-white text-center">
          {language === 'ru'
            ? 'Проверить счетчик в системе СЕРРП'
            : 'Перевірити лічильник в системі СЕРРП'}
        </h2>

        <p className="text-gray-300 mb-6 text-center">
          {language === 'ru'
            ? 'Введите номер счетчика для проверки в базе данных СЕРРП'
            : 'Введіть номер лічильника для перевірки в базі даних СЕРРП'}
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                id="meter-number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:border-blue-400 text-white placeholder-gray-400"
                placeholder={language === 'ru' ? 'Введите номер счетчика' : 'Введіть номер лічильника'}
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-5 h-5" />
              {language === 'ru' ? 'Проверить' : 'Перевірити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SerrpChecker;
