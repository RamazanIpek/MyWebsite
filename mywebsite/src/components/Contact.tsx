// src/components/Contact.tsx
"use client";
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Form gönderme simülasyonu
    try {
      // Normalde burada API çağrısı olacak
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
        <span className="text-purple-500">İletişim</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* İletişim Formu */}
        <div className="bg-gray-800/40 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Bana Ulaşın</h3>
          
          {isSuccess ? (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-400">
                Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Adınız *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-300 mb-2">
                  Konu *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>Bir konu seçin</option>
                  <option value="is-teklifi">İş Teklifi</option>
                  <option value="proje">Proje İşbirliği</option>
                  <option value="danismanlik">Danışmanlık</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold transition duration-300 ${
                  isSubmitting
                    ? 'bg-purple-700 text-white/70 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-white rounded-full"></span>
                    Gönderiliyor...
                  </div>
                ) : (
                  'Mesaj Gönder'
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* İletişim Bilgileri ve Sosyal Medya */}
        <div>
          <div className="bg-gray-800/40 rounded-xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-6">İletişim Bilgileri</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a 
                    href="mailto:info@ramazanipek.com" 
                    className="text-white hover:text-purple-400 transition duration-300"
                  >
                    info@ramazanipek.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Telefon</p>
                  <a 
                    href="tel:+901234567890" 
                    className="text-white hover:text-purple-400 transition duration-300"
                  >
                    +90 (123) 456 7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Konum</p>
                  <p className="text-white">
                    İstanbul, Türkiye
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sosyal Medya Bağlantıları */}
          <div className="bg-gray-800/40 rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Sosyal Medya</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
              
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Twitter
              </a>
              
              <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
              
              <a
                href="https://youtube.com/@yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                YouTube
              </a>
              
              <a
                href="https://medium.com/@yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0v24h24v-24h-24zm19.938 5.686l-1.32.016-1.272 1.27-6.373 6.356-.008 9.662h7.995v-12.388l1.973-1.97.004 14.358h-19.7l.016-.18.004-7.972-.004-8.649 1.625 1.617 1.648-1.617 1.633 1.629 1.643-1.629 1.653 1.637 1.639-1.637 1.639 1.637 1.633-1.637 1.65 1.637 1.639-1.637 1.646 1.624 1.65-1.624z" />
                </svg>
                Medium
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} font-bold mb-6">Bana Ulaşın</h3>
          
          {isSuccess ? (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-400">
                Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Adınız *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-300 mb-2">
                  Konu *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>Bir konu seçin</option>
                  <option value="is-teklifi">İş Teklifi</option>
                  <option value="proje">Proje İşbirliği</option>
                  <option value="danismanlik">Danışmanlık</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold transition duration-300 ${
                  isSubmitting
                    ? 'bg-purple-700 text-white/70 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-white rounded-full"></span>
                    Gönderiliyor...
                  </div>
                ) : (
                  'Mesaj Gönder'
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* İletişim Bilgileri ve Sosyal Medya */}
        <div>
          <div className="bg-gray-800/40 rounded-xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl