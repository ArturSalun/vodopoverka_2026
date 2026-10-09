import React, { useState, useEffect } from 'react';
import {
  Wrench, CheckCircle2, Award,
  Calendar, Timer, AlertCircle, Star, Quote, ShieldCheck, BadgeCheck,
  FileText, Phone, ArrowRight, Gauge, Droplet
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSupabase } from '../context/SupabaseContext';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { ru, uk } from 'date-fns/locale';

function Home() {
  const { supabase } = useSupabase();
  const { content, language } = useLanguage();
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    service: content.contact.serviceOptions[0],
    message: '',
    appointmentDate: null as Date | null,
    appointmentTime: null as Date | null
  });
  const [formErrors, setFormErrors] = useState({ name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [counter, setCounter] = useState(1);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const duration = 4000;
    const steps = 60;
    const increment = Math.ceil(14000 / (duration / (1000 / steps)));
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 14000) { clearInterval(interval); return 14000; }
        return Math.min(prev + increment, 14000);
      });
    }, 1000 / steps);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (!/^(?:\+?38)?0\d{9}$/.test(digits)) {
      return language === 'ru'
        ? 'Введите корректный номер телефона (например: +380971234567)'
        : 'Введіть коректний номер телефону (наприклад: +380971234567)';
    }
    return '';
  };

  const validateName = (name: string) => {
    if (name.length < 2) {
      return language === 'ru' ? 'Имя должно содержать минимум 2 символа' : "Ім'я повинно містити мінімум 2 символи";
    }
    if (!/^[а-яА-ЯёЁіІїЇєЄґҐa-zA-Z\s'-]+$/.test(name)) {
      return language === 'ru' ? 'Имя может содержать только буквы, дефис и апостроф' : "Ім'я може містити лише літери, дефіс та апостроф";
    }
    return '';
  };

  const validateAddress = (address: string) => {
    if (address.length < 5) {
      return language === 'ru' ? 'Адрес должен содержать минимум 5 символов' : 'Адреса повинна містити мінімум 5 символів';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'phone') {
      setFormErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'phone') error = validatePhone(value);
    else if (name === 'name') error = validateName(value);
    else if (name === 'address') error = validateAddress(value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleDateChange = (date: Date | null) => {
    setOrderForm(prev => ({ ...prev, appointmentDate: date }));
  };

  const handleTimeChange = (time: Date | null) => {
    setOrderForm(prev => ({ ...prev, appointmentTime: time }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(orderForm.name);
    const phoneError = validatePhone(orderForm.phone);
    const addressError = validateAddress(orderForm.address);
    setFormErrors({ name: nameError, phone: phoneError, address: addressError });
    if (nameError || phoneError || addressError) return;

    setSubmitting(true);
    try {
      const formattedPhone = orderForm.phone.replace(/\D/g, '');
      const formattedDate = orderForm.appointmentDate ? format(orderForm.appointmentDate, 'yyyy-MM-dd') : null;
      const formattedTime = orderForm.appointmentTime ? format(orderForm.appointmentTime, 'HH:mm:ss') : null;

      const { error } = await supabase.from('service_requests').insert([{
        name: orderForm.name, phone: formattedPhone, address: orderForm.address,
        service_type: orderForm.service, message: orderForm.message || null,
        appointment_date: formattedDate, appointment_time: formattedTime, status: 'new'
      }]);
      if (error) throw error;
      setSubmitSuccess(true);
      setOrderForm({ name: '', phone: '', address: '', service: content.contact.serviceOptions[0], message: '', appointmentDate: null, appointmentTime: null });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(content.contact.form.error);
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = language === 'ru'
    ? 'Повірка лічильників води у Харкові без зняття | VODOPOVERKA — від 690 грн'
    : 'Повірка лічильників води у Харкові без зняття | VODOPOVERKA — від 690 грн';

  const pageDescription = language === 'ru'
    ? 'Поверка счетчиков воды в Харькове без снятия от 690 грн. Официальная метрологическая поверка с выдачей документов. Выезд мастера на дом за 15-20 минут. 14000+ поверок. Тел: 097-135-00-10'
    : 'Повірка лічильників води без зняття у Харкові від 690 грн. Офіційна метрологічна повірка з видачею документів. Виїзд майстра додому за 15-20 хвилин. 14000+ повірок. Тел: 097-135-00-10';

  const advantages = [
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: content.advantages.items[0].title,
      description: language === 'ru' ? 'Все работы по законодательству Украины' : 'Усі роботи за законодавством України',
      stat: `${counter.toLocaleString()}+`,
      statLabel: language === 'ru' ? 'выполненных поверок' : 'виконаних повірок'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: content.advantages.items[1].title,
      description: content.advantages.items[1].description,
      stat: '99.2%',
      statLabel: language === 'ru' ? 'успешных заявок' : 'успішних заявок'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: content.advantages.items[2].title,
      description: content.advantages.items[2].description,
      stat: '9:00–18:00',
      statLabel: language === 'ru' ? 'Пн–Пт' : 'Пн–Пт'
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: content.advantages.items[3].title,
      description: content.advantages.items[3].description,
      stat: '15–20',
      statLabel: language === 'ru' ? 'минут на прибор' : 'хвилин на прилад'
    }
  ];

  const serviceIcons = [
    <Gauge className="w-10 h-10" />,
    <Droplet className="w-10 h-10" />,
    <Wrench className="w-10 h-10" />
  ];

  const services = content.services.items.map((item, index) => ({
    icon: serviceIcons[index] || <Wrench className="w-10 h-10" />,
    title: item.title,
    description: item.description,
    price: item.price
  }));

  const reviews = [
    {
      name: "Ганна Коваленко", rating: 5, date: "2 тижні тому",
      text: "Чудовий сервіс! Майстер прийшов вчасно, все зробив швидко та професійно. Дуже задоволена якістю роботи.",
      image: "https://images.pexels.com/photos/8486978/pexels-photo-8486978.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    },
    {
      name: "Михайло Петренко", rating: 5, date: "1 місяць тому",
      text: "Швидко, якісно, недорого. Рекомендую всім, хто шукає надійну компанію для повірки лічильників.",
      image: "https://images.pexels.com/photos/4483939/pexels-photo-4483939.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    },
    {
      name: "Олена Сидоренко", rating: 5, date: "2 місяці тому",
      text: "Дякую за оперативність та професіоналізм. Всі документи отримала відразу після повірки.",
      image: "https://images.pexels.com/photos/10682438/pexels-photo-10682438.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    },
    {
      name: "Вадим Бондаренко", rating: 5, date: "3 тижні тому",
      text: "Професійні хлопці! Замовляв повірку двох лічильників у п'ятницю, а в понеділок уже все було готово. Ціни справедливі, рекомендую!",
      image: "https://images.pexels.com/photos/33388390/pexels-photo-33388390.jpeg?auto=compress&cs=tinysrgb&h=256&w=256"
    }
  ];

  const heroImage = "https://poverka.net.ua/wp-content/uploads/2021/09/poster-poverka-ukraina.jpg";

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={language === 'ru'
          ? 'поверка счетчиков воды харьков, поверка счетчиков воды без снятия, метрологическая поверка, водомеры харьков, замена счетчика воды харьков, поверка лічильників води харків, цена поверки счетчика воды'
          : 'повірка лічильників води харків, повірка лічильників води без зняття, метрологічна повірка, водоміри харків, заміна лічильника води харків, ціна повірки лічильника води, повірка водоміра вдома'} />
        <link rel="canonical" href="https://vodopoverka.kh.ua" />
        <meta property="og:title" content="VODOPOVERKA — Повірка лічильників води без зняття у Харкові" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content="https://vodopoverka.kh.ua" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO SECTION */}
      <div className="relative text-white overflow-hidden min-h-[600px]">
        {/* Full background image of water meters */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={language === 'ru' ? 'Лічильники води — повірка у Харкові' : 'Лічильники води — повірка у Харкові'}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-blue-950/40"></div>
        <div className="absolute inset-0 bg-water-pattern"></div>

        <Navbar />

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-shadow-lg animate-fade-in-up max-w-4xl">
            {language === 'ru'
              ? 'Поверка счетчиков воды без снятия в Харькове'
              : 'Повірка лічильників води без зняття у Харкові'}
          </h1>

          <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed max-w-3xl animate-fade-in-up text-center" style={{ animationDelay: '0.1s' }}>
            {language === 'ru'
              ? 'Профессиональная поверка счетчиков холодной и горячей воды на дому. Без демонтажа, без срыва пломбы. Выезд мастера за 15–20 минут. Документы, гарантированно принимаемые всеми организациями Украины.'
              : 'Професійна повірка лічильників холодної та гарячої води вдома. Без демонтажу, без зриву пломби. Виїзд майстра за 15–20 хвилин. Документи, що гарантовано приймаються всіма організаціями України.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
              {content.hero.orderButton}
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#prices" className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-700 transition-all duration-300">
              {content.hero.pricesButton}
            </a>
          </div>

          {/* Quick stats bar */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl w-full animate-fade-in-up mb-8" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-accent-300">{counter.toLocaleString()}+</div>
              <div className="text-xs sm:text-sm opacity-80 mt-1">{language === 'ru' ? 'поверок выполнено' : 'повірок виконано'}</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-accent-300">15+</div>
              <div className="text-xs sm:text-sm opacity-80 mt-1">{language === 'ru' ? 'лет опыта' : 'років досвіду'}</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-accent-300">690₴</div>
              <div className="text-xs sm:text-sm opacity-80 mt-1">{language === 'ru' ? 'от за прибор' : 'від за прилад'}</div>
            </div>
          </div>

          {/* Certification badge — moved below stats */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 animate-fade-in-up border border-white/20" style={{ animationDelay: '0.4s' }}>
            <ShieldCheck className="w-5 h-5 text-accent-300" />
            <span className="text-sm font-medium">
              {language === 'ru' ? 'Официальная метрологическая поверка · ГП "Укрметртестстандарт"' : 'Офіційна метрологічна повірка · ДП "Укрметртестстандарт"'}
            </span>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0,40 C320,80 640,0 960,30 C1200,55 1320,40 1440,20 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ADVANTAGES SECTION */}
      <section id="advantages" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{content.advantages.title}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {language === 'ru' ? 'Почему клиенты выбирают VODOPOVERKA для поверки счетчиков воды' : 'Чому клієнти обирають VODOPOVERKA для повірки лічильників води'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-b from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 ${visibleSections.has('advantages') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {adv.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{adv.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{adv.description}</p>
                {adv.stat && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-2xl font-extrabold text-primary-600">{adv.stat}</div>
                    <div className="text-xs text-gray-400">{adv.statLabel}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{content.services.title}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {language === 'ru' ? 'Полный спектр услуг по поверке и замене счетчиков воды в Харькове' : 'Повний спектр послуг з повірки та заміни лічильників води у Харкові'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-300 ${visibleSections.has('services') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl flex items-center justify-center text-primary-600 mb-5 group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-extrabold text-primary-600">{service.price}</span>
                  <a href="#contact" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {language === 'ru' ? 'Заказать' : 'Замовити'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* SEO content block */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                {language === 'ru' ? 'Поверка счетчиков воды в Харькове — профессионально и по закону' : 'Повірка лічильників води у Харкові — професійно та за законом'}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {language === 'ru'
                  ? 'Компания VODOPOVERKA более 15 лет оказывает услуги по поверке счетчиков воды в Харькове. Мы специализируемся на метрологической поверке приборов учета холодной и горячей воды с использованием сертифицированного оборудования — переносных проливных установок (эталонов), которые ежегодно проходят аккредитацию и калибровку в ГП "Укрметртестстандарт".'
                  : 'Компанія VODOPOVERKA понад 15 років надає послуги з повірки лічильників води у Харкові. Ми спеціалізуємося на метрологічній повірці приладів обліку холодної та гарячої води з використанням сертифікованого обладнання — переносних проливних установок (еталонів), які щорічно проходять акредитацію та калібрування в ДП "Укрметртестстандарт".'}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                {language === 'ru'
                  ? 'Поверка счетчиков воды на дому осуществляется без снятия приборов и без срыва пломбы. Мастер приезжает в удобное для вас время и за 15–20 минут проводит официальную поверку. Ежегодно мы выполняем более 14 000 поверок с процентом успеха 99.2%.'
                  : 'Повірка лічильників води вдома здійснюється без зняття приладів та без зриву пломби. Майстер приїжджає в зручний для вас час і за 15–20 хвилин проводить офіційну повірку. Щорічно ми виконуємо понад 14 000 повірок з відсотком успіху 99.2%.'}
              </p>
              <div className="flex items-start gap-3 p-4 bg-success-500/10 rounded-xl mt-6">
                <BadgeCheck className="w-6 h-6 text-success-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 font-medium">
                  {language === 'ru'
                    ? 'Все выданные нами свидетельства о поверке ГАРАНТИРОВАННО принимаются всеми ресурсоснабжающими организациями Харькова и всей Украины!'
                    : 'Усі видані нами свідоцтва про повірку ГАРАНТОВАНО приймаються всіма ресурсопостачальними організаціями Харкова та всієї України!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICES SECTION */}
      <section id="prices" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{content.prices.title}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {language === 'ru' ? 'Прозрачные цены на поверку и замену счетчиков воды в Харькове' : 'Прозорі ціни на повірку та заміну лічильників води у Харкові'}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {content.prices.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-5 transition-colors hover:bg-primary-50/50 ${index !== content.prices.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-10 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
                    <span className="text-gray-800 font-medium">{item.service}</span>
                  </div>
                  <span className="text-xl font-extrabold text-primary-600">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="process" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {language === 'ru' ? 'Как происходит поверка' : 'Як відбувається повірка'}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {language === 'ru' ? 'Простой процесс от заявки до получения документов' : 'Простий процес від заявки до отримання документів'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Phone className="w-7 h-7" />, step: '1', title: language === 'ru' ? 'Заявка' : 'Заявка', desc: language === 'ru' ? 'Оставьте заявку на сайте или позвоните по телефону' : 'Залиште заявку на сайті або зателефонуйте' },
              { icon: <Calendar className="w-7 h-7" />, step: '2', title: language === 'ru' ? 'Визит мастера' : 'Візит майстра', desc: language === 'ru' ? 'Мастер приезжает в удобное для вас время' : 'Майстер приїжджає в зручний для вас час' },
              { icon: <Gauge className="w-7 h-7" />, step: '3', title: language === 'ru' ? 'Поверка' : 'Повірка', desc: language === 'ru' ? 'Проверка счетчиков сертифицированным оборудованием' : 'Перевірка лічильників сертифікованим обладнанням' },
              { icon: <FileText className="w-7 h-7" />, step: '4', title: language === 'ru' ? 'Документы' : 'Документи', desc: language === 'ru' ? 'Свидетельство о поверке с печатями и подписями' : 'Свідоцтво про повірку з печатками та підписами' }
            ].map((item, index) => (
              <div
                key={index}
                className={`relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${visibleSections.has('process') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-extrabold shadow-lg">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / ORDER FORM */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{content.contact.title}</h2>
              <p className="text-gray-500 text-lg">
                {language === 'ru' ? 'Заполните форму и мы свяжемся с вами в ближайшее время' : 'Заповніть форму і ми зв\'яжемося з вами найближчим часом'}
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-success-500/10 border-2 border-success-500/30 rounded-2xl p-8 text-center animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-success-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{content.contact.form.success}</h3>
                <p className="text-gray-500">{language === 'ru' ? 'Можете заполнить еще одну заявку' : 'Можете заповнити ще одну заявку'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">{content.contact.form.name}</label>
                  <input type="text" id="name" name="name" value={orderForm.name} onChange={handleInputChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.name ? 'border-error-500 focus:ring-error-500/20' : 'border-gray-200 focus:ring-primary-200 focus:border-primary-500'}`}
                    required />
                  {formErrors.name && <p className="mt-1.5 text-sm text-error-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.name}</p>}
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">{content.contact.form.phone}</label>
                  <input type="tel" id="phone" name="phone" value={orderForm.phone} onChange={handleInputChange} onBlur={handleBlur} placeholder="+380971234567"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.phone ? 'border-error-500 focus:ring-error-500/20' : 'border-gray-200 focus:ring-primary-200 focus:border-primary-500'}`}
                    required />
                  {formErrors.phone && <p className="mt-1.5 text-sm text-error-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.phone}</p>}
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">{content.contact.form.address}</label>
                  <input type="text" id="address" name="address" value={orderForm.address} onChange={handleInputChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.address ? 'border-error-500 focus:ring-error-500/20' : 'border-gray-200 focus:ring-primary-200 focus:border-primary-500'}`}
                    required />
                  {formErrors.address && <p className="mt-1.5 text-sm text-error-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.address}</p>}
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="service">{content.contact.form.service}</label>
                  <select id="service" name="service" value={orderForm.service} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all">
                    {content.contact.serviceOptions.map((option, index) => <option key={index}>{option}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">{language === 'ru' ? 'Дата визита' : 'Дата візиту'}</label>
                    <DatePicker selected={orderForm.appointmentDate} onChange={handleDateChange} dateFormat="dd.MM.yyyy" minDate={new Date()} locale={language === 'ru' ? ru : uk}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                      placeholderText={language === 'ru' ? 'Выберите дату' : 'Оберіть дату'} required />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">{language === 'ru' ? 'Время визита' : 'Час візиту'}</label>
                    <DatePicker selected={orderForm.appointmentTime} onChange={handleTimeChange} showTimeSelect showTimeSelectOnly timeIntervals={60}
                      timeCaption={language === 'ru' ? 'Время' : 'Час'} dateFormat="HH:mm" locale={language === 'ru' ? ru : uk}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                      placeholderText={language === 'ru' ? 'Выберите время' : 'Оберіть час'}
                      minTime={new Date(new Date().setHours(9, 0))} maxTime={new Date(new Date().setHours(18, 0))} required />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">{content.contact.form.message}</label>
                  <textarea id="message" name="message" value={orderForm.message} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                    rows={3}></textarea>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  {language === 'ru' ? 'Отправляя сообщение, Вы разрешаете сбор и обработку персональных данных согласно ' : 'Відправляючи повідомлення, Ви дозволяєте збір та обробку персональних даних згідно '}
                  <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">{language === 'ru' ? 'Политике конфиденциальности' : 'Політиці конфіденційності'}</a>
                </p>

                <button type="submit" disabled={submitting || Object.values(formErrors).some(e => e !== '')}
                  className={`w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 ${submitting || Object.values(formErrors).some(e => e !== '') ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'}`}>
                  {submitting ? content.contact.form.submitting : content.contact.form.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {language === 'ru' ? 'Отзывы наших клиентов' : 'Відгуки наших клієнтів'}
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {language === 'ru' ? 'Что говорят о нас клиенты на Google Maps' : 'Що кажуть про нас клієнти на Google Maps'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 relative hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-3 right-6 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center mb-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover mr-3" loading="lazy" />
                  <div>
                    <h3 className="font-bold text-gray-900">{review.name}</h3>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}`} />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="https://maps.app.goo.gl/5n8GCdEgvBMTmp7A6" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all border-2 border-primary-200 hover:shadow-lg">
              {language === 'ru' ? 'Смотреть все отзывы на Google Maps' : 'Дивитися всі відгуки на Google Maps'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
