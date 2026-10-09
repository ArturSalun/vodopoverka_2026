import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';

function FAQ() {
  const { content, language } = useLanguage();
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const pageTitle = language === 'ru'
    ? 'Вопросы и ответы - VODOPOVERKA - Поверка счетчиков воды в Харькове'
    : 'Питання та відповіді - VODOPOVERKA - Повірка лічильників води у Харкові';

  const pageDescription = language === 'ru'
    ? 'Ответы на часто задаваемые вопросы о поверке счетчиков воды. Узнайте больше о процессе поверки, сроках и документах.'
    : 'Відповіді на часті запитання про повірку лічильників води. Дізнайтеся більше про процес повірки, терміни та документи.';

  const googleReviews = [
    {
      name: "Dmitriy Manzhosov",
      date: "3 тижні тому",
      rating: 5,
      text: "Велике спасибі за роботу, реально приємно порадували. Подзвонив — одразу взяли трубку, все спокійно і нормально пояснили. Нічого зайвого не напарювали: одразу сказали, що якщо з лічильником все гаразд, то просто робимо повірку і все приймається. Про строки домовилися, прийшов чоловік рівно в той час, про який і домовлялися. Заздалегідь подзвонив, піднявся, все швидко і акуратно повірив, документи підписали. Пізніше, як і обіцяли, прислали всі папери і попросили залишити відгук. Видно, що все чітко організовано і люди реально дбають за свій бізнес і сервіс. Ребята, молодці, приємно з такими працювати!",
      avatar: "https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    },
    {
      name: "Олена Ковальчук",
      date: "2 тижні тому",
      rating: 5,
      text: "Чудовий сервіс! Майстер прийшов вчасно, все зробив швидко та професійно. Дуже задоволена якістю роботи.",
      avatar: "https://images.pexels.com/photos/8486978/pexels-photo-8486978.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    },
    {
      name: "Михайло Петренко",
      date: "1 місяць тому",
      rating: 5,
      text: "Швидко, якісно, недорого. Рекомендую всім, хто шукає надійну компанію для повірки лічильників.",
      avatar: "https://images.pexels.com/photos/4483939/pexels-photo-4483939.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    },
    {
      name: "Марія Сидоренко",
      date: "2 місяці тому",
      rating: 5,
      text: "Дякую за оперативність та професіоналізм. Всі документи отримала відразу після повірки.",
      avatar: "https://images.pexels.com/photos/10682438/pexels-photo-10682438.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={language === 'ru'
          ? 'вопросы о поверке счетчиков, как проходит поверка счетчиков воды, сроки поверки счетчиков, документы для поверки'
          : 'питання про повірку лічильників, як проходить повірка лічильників води, терміни повірки лічильників, документи для повірки'}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": content.faq.questions.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.replace(/\n\n/g, ' ')
              }
            }))
          })}
        </script>
      </Helmet>

      <PageHero title={content.faq.title} subtitle={content.faq.subtitle} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto mb-20">
            {content.faq.questions.map((faq, index) => (
              <div
                key={index}
                className="mb-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <button
                  className="w-full flex justify-between items-center p-5 sm:p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 pr-4">{faq.question}</h3>
                  {openQuestion === index ? (
                    <ChevronUp className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  )}
                </button>

                {openQuestion === index && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 bg-white border-t border-gray-100 pt-4">
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Google Reviews */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{content.faq.reviews.title}</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">{content.faq.reviews.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {googleReviews.map((review, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-primary-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="https://maps.app.goo.gl/5n8GCdEgvBMTmp7A6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {language === 'ru' ? 'Смотреть все отзывы на Google Maps' : 'Дивитися всі відгуки на Google Maps'}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FAQ;
