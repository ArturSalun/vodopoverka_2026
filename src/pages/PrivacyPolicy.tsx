import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

function PrivacyPolicy() {
  const { content } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{content.privacy.title} - VODOPOVERKA</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <PageHero title={content.privacy.title} subtitle="" />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">{content.privacy.content.intro}</p>

          {content.privacy.content.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-600 mb-4 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
