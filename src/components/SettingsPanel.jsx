import { sfx } from './SoundEffects';
import { useTheme } from './ThemeContext';

export default function SettingsPanel({
  isOpen,
  onClose,
  currentLang,
  setLang,
  onOpenAdmin,
  activePlaylist,
  onSelectTrack
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      id="settingsPanel"
      className={`settings-panel fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-[0_0_40px_rgba(0,0,0,0.3)] z-50 p-6 overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-8 group">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all group-hover:tracking-wider">
          Settings
        </h3>
        <button
          onClick={() => {
            sfx.playClick();
            onClose();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:rotate-90 text-gray-700 dark:text-gray-200"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      <div className="space-y-8">
        {/* Language Block */}
        <div className="settings-block transform transition-all duration-500 hover:translate-x-1">
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <i className="ri-translate-2"></i> Language
          </h4>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                sfx.playTab();
                setLang('en');
              }}
              className={`flex-1 p-3 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                currentLang === 'en'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                sfx.playTab();
                setLang('id');
              }}
              className={`flex-1 p-3 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                currentLang === 'id'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              ID
            </button>
          </div>
        </div>

        {/* Theme Block */}
        <div className="settings-block transform transition-all duration-500 hover:translate-x-1">
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <i className="ri-palette-line"></i> Theme
          </h4>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                sfx.playTab();
                if (theme === 'dark') toggleTheme();
              }}
              className={`flex-1 p-3 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <i className="ri-sun-line mr-1"></i> Light
            </button>
            <button
              onClick={() => {
                sfx.playTab();
                if (theme === 'light') toggleTheme();
              }}
              className={`flex-1 p-3 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <i className="ri-moon-line mr-1"></i> Dark
            </button>
          </div>
        </div>

        {/* Music Playlist */}
        {activePlaylist && (
          <div className="settings-block transform transition-all duration-500 hover:translate-x-1">
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <i className="ri-music-2-line"></i> Music Playlist
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {activePlaylist.map((track, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sfx.playClick();
                    onSelectTrack(idx);
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <i className="ri-play-fill text-primary"></i>
                  <span className="truncate text-gray-700 dark:text-gray-300">{track.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        <div className="settings-block transform transition-all duration-500 hover:translate-x-1 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => {
              sfx.playClick();
              onOpenAdmin();
            }}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:scale-105 transition-transform duration-300"
          >
            <i className="ri-admin-line"></i>
            <span>Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
