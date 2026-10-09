import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock, MapPin, Instagram, GitBranch as BrandTelegram, ArrowRight } from 'lucide-react';
import { init, send } from '@emailjs/browser';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useSupabase } from '../context/SupabaseContext';
import { Helmet } from 'react-helmet-async';

function Contact() {
  const { content, language } = useLanguage();
  const { supabase } = useSupabase();
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    init("iQbJXSREl_Ju6RlUg");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCallbackForm(prev => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (name: string, phone: string) => {
    const templateParams = {
      to_email: 'vodopoverka@gmail.com',
      from_name: name,
      phone: phone,
      message: `Новий запит на зворотній дзвінок від ${name}. Телефон: ${phone}`
    };
    await send('service_ne73d1l', 'template_ul66qtb', templateParams);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const { error: supabaseError } = await supabase.from('service_requests').insert([{
        name: callbackForm.name, phone: callbackForm.phone, address: '-',
        service_type: language === 'ru' ? 'Обратный звонок' : 'Зворотній дзвінок',
        message: language === 'ru' ? 'Клиент запросил обратный звонок' : 'Клієнт запросив зворотній дзвінок'
      }]);
      if (supabaseError) throw supabaseError;
      await sendEmail(callbackForm.name, callbackForm.phone);
      setSubmitted(true);
      setCallbackForm({ name: '', phone: '' });
    } catch (error) {
      console.error('Error submitting callback form:', error);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = language === 'ru'
    ? 'Контакты - VODOPOVERKA - Поверка счетчиков воды в Харькове'
    : 'Контакти - VODOPOVERKA - Повірка лічильників води у Харкові';
  const pageDescription = language === 'ru'
    ? 'Контактная информация компании VODOPOVERKA. Телефоны, адрес, график работы. Закажите поверку счетчиков воды в Харькове.'
    : 'Контактна інформація компанії VODOPOVERKA. Телефони, адреса, графік роботи. Замовте повірку лічильників води у Харкові.';

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6" />, title: content.contactPage.phones,
      content: (
        <div className="space-y-1">
          <a href="tel:+380971350010" className="block text-lg text-gray-700 hover:text-primary-600 transition-colors">097-135-00-10</a>
          <a href="tel:+380991350010" className="block text-lg text-gray-700 hover:text-primary-600 transition-colors">099-135-00-10</a>
        </div>
      )
    },
    {
      icon: <Mail className="w-6 h-6" />, title: content.contactPage.email,
      content: <a href="mailto:vodopoverka@gmail.com" className="text-lg text-gray-700 hover:text-primary-600 transition-colors">vodopoverka@gmail.com</a>
    },
    {
      icon: <MapPin className="w-6 h-6" />, title: content.contactPage.address,
      content: <p className="text-lg text-gray-700">{language === 'ru' ? 'ул. Нетеченская наб. 14, оф. 300, г. Харьков' : 'вул. Нетеченська наб. 14, оф. 300, м. Харків'}</p>
    },
    {
      icon: <Clock className="w-6 h-6" />, title: content.contactPage.workHours,
      content: (
        <div className="space-y-1 text-lg text-gray-700">
          <p>{language === 'ru' ? 'Пн-Пт: 9:00 - 18:00' : 'Пн-Пт: 9:00 - 18:00'}</p>
          <p>{language === 'ru' ? 'Сб: 10:00 - 15:00' : 'Сб: 10:00 - 15:00'}</p>
          <p>{language === 'ru' ? 'Вс: Выходной' : 'Нд: Вихідний'}</p>
        </div>
      )
    },
    {
      icon: <Instagram className="w-6 h-6" />, title: content.contactPage.social,
      content: (
        <div className="space-y-2 text-lg">
          <a href="https://www.instagram.com/vodopoverka?igsh=MTB0dTZkdmc0b2R6bw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
            <Instagram className="w-5 h-5 mr-2 text-primary-600" />@vodopoverka
          </a>
          <a href="https://t.me/vodopover" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
            <BrandTelegram className="w-5 h-5 mr-2 text-primary-600" />@vodopover
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={language === 'ru'
          ? 'контакты водоповерка, поверка счетчиков воды харьков, адрес водоповерка, телефон поверка счетчиков'
          : 'контакти водоповірка, повірка лічильників води харків, адреса водоповірка, телефон повірка лічильників'}
        />
      </Helmet>

      <PageHero title={content.contactPage.title} subtitle={content.contactPage.subtitle} />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-6">
              {contactCards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <h2 className="text-lg sm:text-xl font-bold mb-3 text-primary-600 flex items-center gap-2">
                    {card.icon}
                    {card.title}
                  </h2>
                  {card.content}
                </div>
              ))}

              {/* Callback Form */}
              <div id="callback" className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 scroll-mt-24">
                <h2 className="text-lg sm:text-xl font-bold mb-2 text-primary-600">
                  {content.contactPage.callbackTitle}
                </h2>
                <p className="text-gray-500 mb-6">{content.contactPage.callbackSubtitle}</p>

                {submitted ? (
                  <div className="p-4 bg-success-500/10 border border-success-500/30 rounded-xl text-success-700">
                    {content.contactPage.callbackSuccess}
                  </div>
                ) : error ? (
                  <div className="p-4 bg-error-500/10 border border-error-500/30 rounded-xl text-error-700">
                    {content.contactPage.callbackError}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="callback-name">{content.contact.form.name}</label>
                      <input type="text" id="callback-name" name="name" value={callbackForm.name} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="callback-phone">{content.contact.form.phone}</label>
                      <input type="tel" id="callback-phone" name="phone" value={callbackForm.phone} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all" required />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {language === 'ru'
                        ? 'Отправляя сообщение, Вы разрешаете сбор и обработку персональных данных согласно '
                        : 'Відправляючи повідомлення, Ви дозволяєте збір та обробку персональних даних згідно '}
                      <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">{language === 'ru' ? 'Политике конфиденциальности' : 'Політиці конфіденційності'}</a>
                    </p>
                    <button type="submit" disabled={submitting}
                      className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}>
                      {submitting ? content.contactPage.callbackSubmitting : content.contactPage.callbackSubmit}
                      {!submitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="h-[400px] lg:h-full min-h-[600px] rounded-2xl overflow-hidden shadow-md border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.1545247022283!2d36.23099491571655!3d49.99747297941492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a0dc6a129675%3A0x7774d795f33c314e!2z0J3QtdGC0LXRh9C10L3RgdC60LDRjyDQvdCw0LEuLCAxNCwg0KXQsNGA0YzQutC-0LIsINCl0LDRgNGM0LrQvtCy0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsINCj0LrRgNCw0LjQvdCwLCA2MTAwMA!5e0!3m2!1sru!2sus!4v1653395698425!5m2!1sru!2sus"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
