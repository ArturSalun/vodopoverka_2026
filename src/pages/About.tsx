import { Award, Users, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';

function About() {
  const { content, language } = useLanguage();
  const navigate = useNavigate();

  const pageTitle = language === 'ru'
    ? 'О нас - VODOPOVERKA - Поверка счетчиков воды в Харькове'
    : 'Про нас - VODOPOVERKA - Повірка лічильників води у Харкові';

  const pageDescription = language === 'ru'
    ? 'Информация о компании VODOPOVERKA. Наш опыт, команда и подход к работе. Профессиональная поверка счетчиков воды в Харькове.'
    : 'Інформація про компанію VODOPOVERKA. Наш досвід, команда та підхід до роботи. Професійна повірка лічильників води у Харкові.';

  const handleContactClick = () => {
    navigate('/contact#callback');
  };

  const teamMembers = [
    {
      name: language === 'ru' ? 'Галанський Р. П.' : 'Галанський Р. П.',
      position: language === 'ru' ? 'Главный метролог' : 'Головний метролог',
      description: language === 'ru'
        ? 'Более 15 лет опыта в сфере метрологии. Сертифицированный специалист по поверке счетчиков воды и тепла.'
        : 'Більше 15 років досвіду в сфері метрології. Сертифікований спеціаліст з повірки лічильників води та тепла.',
      image: 'https://images.pexels.com/photos/7480249/pexels-photo-7480249.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    },
    {
      name: 'Салун А.Г.',
      position: language === 'ru' ? 'Руководитель отдела обслуживания' : 'Керівник відділу обслуговування',
      description: language === 'ru'
        ? 'Отвечает за качество обслуживания клиентов и координацию работы мастеров. Всегда готов ответить на ваши вопросы.'
        : 'Відповідає за якість обслуговування клієнтів та координацію роботи майстрів. Завжди готова відповісти на ваші запитання.',
      image: 'https://images.pexels.com/photos/7477748/pexels-photo-7477748.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    },
    {
      name: language === 'ru' ? 'Бондарев А.С.' : 'Бондарєв А.С.',
      position: language === 'ru' ? 'Технический специалист' : 'Технічний спеціаліст',
      description: language === 'ru'
        ? 'Эксперт по установке и замене счетчиков. Выполняет работы любой сложности быстро и качественно.'
        : 'Експерт з встановлення та заміни лічильників. Виконує роботи будь-якої складності швидко та якісно.',
      image: 'https://images.pexels.com/photos/7492581/pexels-photo-7492581.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    }
  ];

  const stats = [
    { icon: <Award className="w-8 h-8" />, title: language === 'ru' ? '15+ лет опыта' : '15+ років досвіду', desc: language === 'ru' ? 'Работаем с 2010 года на рынке метрологических услуг' : 'Працюємо з 2010 року на ринку метрологічних послуг' },
    { icon: <Users className="w-8 h-8" />, title: language === 'ru' ? 'Команда профессионалов' : 'Команда професіоналів', desc: language === 'ru' ? 'Квалифицированные специалисты с сертификатами' : 'Кваліфіковані спеціалісти з сертифікатами' },
    { icon: <Clock className="w-8 h-8" />, title: language === 'ru' ? 'Быстрое обслуживание' : 'Швидке обслуговування', desc: language === 'ru' ? 'Выполняем работы в кратчайшие сроки' : 'Виконуємо роботи найкоротші терміни' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={language === 'ru'
          ? 'о компании водоповерка, поверка счетчиков воды харьков, метрологические услуги, команда специалистов'
          : 'про компанію водоповірка, повірка лічильників води харків, метрологічні послуги, команда фахівців'}
        />
      </Helmet>

      <PageHero title={content.about.title} subtitle={content.about.subtitle} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Company Info */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
              {content.about.content.map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white mb-3">
                      {stat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{stat.title}</h3>
                    <p className="text-gray-500 text-sm">{stat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={handleContactClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {language === 'ru' ? 'Заказать обратный звонок' : 'Замовити зворотній дзвінок'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{content.about.team.title}</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">{content.about.team.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-300">
                  <div className="h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-primary-600 font-medium mb-4">{member.position}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
