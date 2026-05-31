import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { ThemeProvider } from './components/ThemeContext';
import { sfx } from './components/SoundEffects';
import MeshGradient from './components/MeshGradient';
import ClickRipple from './components/ClickRipple';
import PageTransition from './components/PageTransition';
import SettingsPanel from './components/SettingsPanel';
import MusicPlayer, { playlist } from './components/MusicPlayer';
import AdminDashboard from './components/AdminDashboard';
import ParticlesBg from './components/ParticlesBg';

// EN/ID Dictionary for Dynamic Translations
const dict = {
  en: {
    welcome_title: "Welcome To My Portfolio",
    welcome_desc: "No limits to create, no stop to keep developing",
    about_title: "About Me",
    download_cv: "Download CV",
    contact_me: "Contact Me",
    play_game: "Play Game",
    cv_downloaded: "CV downloaded successfully",
    education: "Education",
    exp_work: "Exp Work",
    organization: "Organization",
    contact_title: "Let's Work Together",
    contact_desc: "Ready to bring your ideas to life? Let's discuss your project and create something amazing together.",
    send_message: "Send Message",
    subject: "Subject",
    message: "Message",
    name: "Name",
    email: "Email",
    message_sent: "Message sent successfully!"
  },
  id: {
    welcome_title: "Selamat Datang di Portofolio Saya",
    welcome_desc: "Tanpa batas untuk berkarya, tanpa henti untuk terus berkembang",
    about_title: "Tentang Saya",
    download_cv: "Unduh CV",
    contact_me: "Hubungi Saya",
    play_game: "Mainkan Game",
    cv_downloaded: "CV berhasil diunduh",
    education: "Pendidikan",
    exp_work: "Pengalaman Kerja",
    organization: "Organisasi",
    contact_title: "Mari Bekerja Sama",
    contact_desc: "Siap mewujudkan ide Anda? Mari diskusikan proyek Anda dan buat sesuatu yang luar biasa bersama.",
    send_message: "Kirim Pesan",
    subject: "Subjek",
    message: "Pesan",
    name: "Nama",
    email: "Email",
    message_sent: "Pesan berhasil terkirim!"
  }
};

const defaultPortfolioData = {
  profile: {
    name: "Fakhul Rohman Nurokhim",
    bio: "Perkenalkan, saya Fakhul Rohman Nurokhim. Dengan rasa ingin tahu yang besar, saya terbuka pada hal-hal baru serta tantangan yang mendukung pengembangan diri."
  },
  education: [
    { year: "2013 - 2019", title: "MI HAYATUL ISLAMIYAH", desc: "Madrasah Ibtidaiyah (MI)", icon: "ri-school-line", iconBg: "bg-blue-100 dark:bg-blue-900/40", iconColor: "text-blue-600 dark:text-blue-400" },
    { year: "2019 - 2022", title: "SMP ISLAM YAPKUM", desc: "Sekolah Menengah Pertama (SMP)", icon: "ri-book-open-line", iconBg: "bg-green-100 dark:bg-green-900/40", iconColor: "text-green-600 dark:text-green-400" },
    { year: "2022 - 2025", title: "SMK AL-HIDAYAH", desc: "Sekolah Menengah Kejuruan (SMK) AKUNTANSI", icon: "ri-bank-line", iconBg: "bg-purple-100 dark:bg-purple-900/40", iconColor: "text-purple-600 dark:text-purple-400" }
  ],
  experience: [
    { id: "expWork1", year: "2024 - Present", title: "Frontend Developer", desc: "Membangun antarmuka interaktif dan responsif menggunakan teknologi modern seperti React dan TailwindCSS.", icon: "ri-code-box-line", color: "blue", details: ["Membangun antarmuka interaktif dan responsif menggunakan React, Vue.js, dan Tailwind CSS.", "Mengoptimalkan performa rendering halaman dan aksesibilitas.", "Berkolaborasi dengan UI/UX Designer."] },
    { id: "expWork2", year: "2023 - 2024", title: "UI/UX Designer", desc: "Merancang prototipe aplikasi dan website yang berpusat pada pengalaman pengguna menggunakan Figma.", icon: "ri-brush-line", color: "purple", details: ["Merancang wireframe, mockup, dan prototipe interaktif menggunakan Figma.", "Melakukan riset pengguna.", "Memastikan konsistensi design system."] },
    { id: "expWork3", year: "2022 - 2023", title: "Backend Intern", desc: "Membantu pengembangan RESTful API dan manajemen database menggunakan Node.js dan MongoDB.", icon: "ri-server-line", color: "green", details: ["Membantu pengembangan RESTful API menggunakan Node.js dan Express.", "Mengintegrasikan database NoSQL (MongoDB).", "Menulis unit test."] }
  ],
  organization: [
    { title: "OSIS", role: "Bendahara Pria (2024-2025)", desc: "Mengelola keuangan kegiatan siswa, memastikan laporan transparan, dan mendukung kelancaran program sekolah.", icon: "ri-team-line", color: "indigo" },
    { title: "Pramuka", role: "Ketua (2 Periode)", desc: "Memimpin berbagai kegiatan perkemahan, melatih kedisiplinan anggota, dan meningkatkan partisipasi aktif hingga 40%.", icon: "ri-fire-line", color: "orange" },
    { title: "IT Club", role: "Koordinator Web (2023-2024)", desc: "Mengadakan workshop pemrograman dasar, mengelola website komunitas, dan memfasilitasi diskusi teknologi terbaru.", icon: "ri-code-s-slash-line", color: "emerald" }
  ]
};

function AppContent() {
  const [lang, setLang] = useState('id');
  const [activeTab, setActiveTab] = useState('education');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [activeModalId, setActiveModalId] = useState(null);
  const [transitionTrigger, setTransitionTrigger] = useState(false);
  const [targetHref, setTargetHref] = useState('');
  
  // Dynamic CV Download Toast
  const [showCvToast, setShowCvToast] = useState(false);

  // Dynamic Portfolio State (PRD CRUD Compliant)
  const [portfolioData, setPortfolioData] = useState(() => {
    return JSON.parse(localStorage.getItem('portfolio_data_v2')) || defaultPortfolioData;
  });

  const t = dict[lang];

  const handleSaveData = (updatedData) => {
    setPortfolioData(updatedData);
    localStorage.setItem('portfolio_data_v2', JSON.stringify(updatedData));
    setIsAdminOpen(false);
    
    // Confetti pop feedback!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 }
    });
  };

  const handleDownloadCv = () => {
    sfx.playClick();
    setShowCvToast(true);
    confetti({ particleCount: 50, spread: 50 });
    setTimeout(() => setShowCvToast(false), 3000);
  };

  const handleNavigatePage = (href) => {
    sfx.playOpenModal();
    setTargetHref(href);
    setTransitionTrigger(true);
  };

  const handleTransitionComplete = () => {
    // Navigate cleanly in react context or window location
    window.location.href = targetHref;
  };

  return (
    <>
      <MeshGradient />
      <ParticlesBg />
      <ClickRipple />
      
      <PageTransition
        trigger={transitionTrigger}
        onComplete={handleTransitionComplete}
      />

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-pacifico text-2xl font-bold text-primary">Fatkul</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <a href="#welcome" className="text-sm font-semibold hover:text-primary transition-colors text-gray-700 dark:text-gray-300">Home</a>
            <a href="#about" className="text-sm font-semibold hover:text-primary transition-colors text-gray-700 dark:text-gray-300">About</a>
            <a href="#contact" className="text-sm font-semibold hover:text-primary transition-colors text-gray-700 dark:text-gray-300">Contact</a>
            
            <button
              id="settingsBtn"
              onClick={() => {
                sfx.playClick();
                setIsSettingsOpen(true);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 text-gray-700 dark:text-gray-200 transition-all"
            >
              <i className="ri-settings-line text-lg"></i>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN MAIN CONTENT */}
      <main className="pt-24 pb-32">
        
        {/* HERO SECTION */}
        <section id="welcome" className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-6">
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Parallax Floating Shapes */}
            <div className="absolute -top-12 -left-16 w-24 h-24 border border-blue-500/15 rounded-full pointer-events-none hidden md:block animate-pulse"></div>
            <div className="absolute -bottom-8 -right-16 w-32 h-32 border border-purple-500/15 rounded-full pointer-events-none hidden md:block animate-pulse"></div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              {t.welcome_title}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-medium"
            >
              {t.welcome_desc}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={handleDownloadCv}
                className="glow-button bg-primary hover:bg-primary/95 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
              >
                <i className="ri-download-line"></i>
                <span>{t.download_cv}</span>
              </button>
              
              <a
                href="#contact"
                className="glow-button bg-secondary hover:bg-secondary/95 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-secondary/25 hover:scale-105 active:scale-95 transition-all"
              >
                <i className="ri-mail-line"></i>
                <span>{t.contact_me}</span>
              </a>

              <button
                onClick={() => handleNavigatePage('game.html')}
                className="glow-button bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <i className="ri-gamepad-line"></i>
                <span>{t.play_game}</span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* ABOUT SECTION (Dynamic CRUD Rendered) */}
        <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300 border-4 border-white dark:border-gray-800">
              <img src="assets/profile/p.webp" alt="Profile" className="w-full h-full object-cover object-top" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{t.about_title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Perkenalkan, saya <b>{portfolioData.profile.name}</b>. {portfolioData.profile.bio.replace("Perkenalkan, saya Fakhul Rohman Nurokhim.", "")}
            </p>
          </div>

          {/* iOS TABS NAVIGATION */}
          <div className="flex justify-center mb-12 relative z-10 w-full max-w-2xl mx-auto">
            <div className="relative flex w-full p-1 bg-gray-200/80 dark:bg-gray-800/80 rounded-full shadow-inner border border-gray-300 dark:border-gray-700 backdrop-blur-md">
              
              {/* iOS Tab Indicator Slider */}
              <div
                className="absolute top-1 bottom-1 left-1 rounded-full bg-white dark:bg-gray-700 shadow-md transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-[calc(33.333%-0.5rem)]"
                style={{
                  transform: `translateX(${
                    activeTab === 'education' ? '0%' : activeTab === 'experience' ? '100%' : '200%'
                  })`
                }}
              />
              
              <button
                onClick={() => {
                  sfx.playTab();
                  setActiveTab('education');
                }}
                className={`flex-1 relative z-10 py-3 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center ${
                  activeTab === 'education' ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                }`}
              >
                <i className="ri-book-line mr-1 sm:mr-2"></i>{t.education}
              </button>
              <button
                onClick={() => {
                  sfx.playTab();
                  setActiveTab('experience');
                }}
                className={`flex-1 relative z-10 py-3 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center ${
                  activeTab === 'experience' ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                }`}
              >
                <i className="ri-briefcase-line mr-1 sm:mr-2"></i>{t.exp_work}
              </button>
              <button
                onClick={() => {
                  sfx.playTab();
                  setActiveTab('organization');
                }}
                className={`flex-1 relative z-10 py-3 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center ${
                  activeTab === 'organization' ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
                }`}
              >
                <i className="ri-group-line mr-1 sm:mr-2"></i>{t.organization}
              </button>
            </div>
          </div>

          {/* TAB CONTENTS (Framer Motion Staggered lists) */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'education' && (
                <motion.div
                  key="education"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-3xl mx-auto relative"
                >
                  {/* Progress Line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-1 bg-gray-200 dark:bg-gray-700 h-full rounded-full" />
                  
                  <div className="space-y-12 relative z-10 pt-4">
                    {portfolioData.education.map((edu, idx) => {
                      const isLeft = idx % 2 === 0;
                      return (
                        <div
                          key={idx}
                          className={`flex justify-between items-center w-full ${
                            isLeft ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <div className="w-5/12" />
                          <div className="z-20 flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-md text-white">
                            <i className={edu.icon}></i>
                          </div>
                          
                          <div className="w-5/12 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transform hover:-translate-y-1 transition-all duration-300">
                            <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full">{edu.year}</span>
                            <h3 className="text-lg font-bold mt-3 dark:text-white leading-snug">{edu.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: edu.desc }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div
                  key="experience"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid md:grid-cols-3 gap-6 pt-4"
                >
                  {portfolioData.experience.map((exp, idx) => {
                    const color = exp.color || 'blue';
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          sfx.playOpenModal();
                          setActiveModalId(exp.id);
                        }}
                        className="glass-card-premium group relative rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border"
                      >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150`} />
                        <div className={`w-14 h-14 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300`}>
                          <i className={`${exp.icon} text-3xl text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        <span className={`text-sm font-bold text-${color}-500 mb-2 block`}>{exp.year}</span>
                        <h3 className={`text-xl font-bold mb-2 dark:text-white group-hover:text-${color}-500 transition-colors`}>{exp.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{exp.desc}</p>
                        
                        <div className={`mt-4 flex items-center text-${color}-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                          Lihat Detail <i className="ri-arrow-right-line ml-1"></i>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'organization' && (
                <motion.div
                  key="organization"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid md:grid-cols-3 gap-6 pt-4"
                >
                  {portfolioData.organization.map((org, idx) => {
                    const color = org.color || 'indigo';
                    return (
                      <div
                        key={idx}
                        className={`org-card bg-gradient-to-br from-${color}-50 to-${color}-100/50 dark:from-gray-800 dark:to-${color}-950/20 p-6 rounded-2xl shadow-lg border border-${color}-100 dark:border-gray-800 transform hover:-translate-y-1 transition-all duration-350`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 bg-${color}-500 text-white rounded-full flex items-center justify-center shadow-md`}>
                            <i className={`${org.icon || 'ri-team-line'} text-xl`}></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg dark:text-white leading-tight">{org.title}</h3>
                            <span className={`text-${color}-500 dark:text-${color}-400 text-sm font-medium`}>{org.role}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{org.desc}</p>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 px-6 max-w-6xl mx-auto relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t.contact_title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t.contact_desc}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 hover:translate-x-1 transition-transform cursor-pointer">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center"><i className="ri-mail-line"></i></div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">fakhulrohman@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4 hover:translate-x-1 transition-transform cursor-pointer">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center"><i className="ri-linkedin-line"></i></div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">LinkedIn - Fakhul Rohman</span>
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-250 dark:border-gray-800 p-8 rounded-3xl shadow-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sfx.playClick();
                  confetti({ particleCount: 120, spread: 80 });
                  alert(t.message_sent);
                  e.target.reset();
                }}
                className="space-y-6"
              >
                <div className="relative">
                  <input type="text" required placeholder=" " className="peer w-full px-4 pt-5 pb-2 border rounded-xl dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-primary outline-none" />
                  <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary transition-all pointer-events-none">{t.name}</label>
                </div>
                <div className="relative">
                  <input type="email" required placeholder=" " className="peer w-full px-4 pt-5 pb-2 border rounded-xl dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-primary outline-none" />
                  <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary transition-all pointer-events-none">{t.email}</label>
                </div>
                <div className="relative">
                  <textarea required rows={4} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border rounded-xl dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-primary outline-none" />
                  <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary transition-all pointer-events-none">{t.message}</label>
                </div>
                
                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold overflow-hidden shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <span>{t.send_message}</span>
                  <i className="ri-send-plane-line transition-transform group-hover:translate-x-1"></i>
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* PERSISTENT MUSIC PLAYER */}
      <MusicPlayer
        currentTrackIdx={currentTrackIdx}
        setTrackIdx={setCurrentTrackIdx}
      />

      {/* FLOATING SETTINGS DRAWER */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLang={lang}
        setLang={setLang}
        onOpenAdmin={() => {
          setIsSettingsOpen(false);
          setIsAdminOpen(true);
        }}
        activePlaylist={playlist}
        onSelectTrack={setCurrentTrackIdx}
      />

      {/* CRUD ADMIN modal */}
      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          portfolioData={portfolioData}
          onSave={handleSaveData}
        />
      )}

      {/* DYNAMIC MODALS FOR EXP WORK */}
      <AnimatePresence>
        {activeModalId && (() => {
          const exp = portfolioData.experience.find(e => e.id === activeModalId);
          if (!exp) return null;
          const color = exp.color || 'blue';
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  sfx.playClick();
                  setActiveModalId(null);
                }}
                className="absolute inset-0 bg-black/50"
              />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full border border-gray-100 dark:border-gray-700 shadow-2xl z-10"
              >
                <button
                  onClick={() => {
                    sfx.playClick();
                    setActiveModalId(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
                
                <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2">
                  <i className={`${exp.icon} text-${color}-500`}></i> {exp.title}
                </h2>
                
                <p className={`text-sm font-semibold text-${color}-500 mb-4`}>{exp.year}</p>
                
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  {exp.details ? exp.details.map((d, i) => <li key={i}>{d}</li>) : <li>{exp.desc}</li>}
                </ul>
                
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setActiveModalId(null);
                    }}
                    className={`px-6 py-2.5 rounded-xl bg-${color}-500 hover:bg-${color}-600 text-white font-bold transition-all hover:scale-105 active:scale-95`}
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* CV TOAST NOTIFICATION */}
      <AnimatePresence>
        {showCvToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-20 right-4 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 z-[9999]"
          >
            <i className="ri-checkbox-circle-line text-green-400"></i>
            <span className="font-semibold text-sm">{t.cv_downloaded}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

/* TAILWIND CLASS SAFELIST COMMENT (for dynamic rendering compilation)
bg-blue-500/10 bg-purple-500/10 bg-green-500/10 bg-indigo-500/10 bg-orange-500/10 bg-emerald-500/10
bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400
bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400
bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400
bg-blue-100 dark:bg-blue-900/30 rounded-xl text-3xl text-blue-600 dark:text-blue-400 text-sm font-bold text-blue-500 group-hover:text-blue-500
bg-purple-100 dark:bg-purple-900/30 rounded-xl text-3xl text-purple-600 dark:text-purple-400 text-sm font-bold text-purple-500 group-hover:text-purple-500
bg-green-100 dark:bg-green-900/30 rounded-xl text-3xl text-green-600 dark:text-green-400 text-sm font-bold text-green-500 group-hover:text-green-500
bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-gray-800 dark:to-indigo-950/20 border-indigo-100 bg-indigo-500 text-indigo-500 dark:text-indigo-400
bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-gray-800 dark:to-orange-950/20 border-orange-100 bg-orange-500 text-orange-500 dark:text-orange-400
bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-gray-800 dark:to-emerald-950/20 border-emerald-100 bg-emerald-500 text-emerald-500 dark:text-emerald-400
*/
