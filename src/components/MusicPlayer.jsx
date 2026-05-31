/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from 'react';
import { sfx } from './SoundEffects';

export const playlist = [
  {
    id: "t1",
    title: "Shake It To The Max",
    artist: "Moliy",
    src: "assets/music/sample1.mp3",
    cover: "assets/music/covers/c1.png"
  },
  {
    id: "t2",
    title: "Confes Your Love Song",
    artist: "Jiandro",
    src: "assets/music/sample2.mp3",
    cover: "assets/music/covers/c2.png"
  },
  {
    id: "t3",
    title: "SHAMELESS",
    artist: "Camila Cabello",
    src: "assets/music/sample3.mp3",
    cover: "assets/music/covers/c3.png"
  },
  {
    id: "t4",
    title: "From The Star",
    artist: "Laufey",
    src: "assets/music/sample4.mp3",
    cover: "assets/music/covers/c4.png"
  },
  {
    id: "t5",
    title: "Gata Only Remix",
    artist: "FloyyMenor, Ozuna, dan Anitta.",
    src: "assets/music/sample5.mp3",
    cover: "assets/music/covers/c5.png"
  }
];

export default function MusicPlayer({ currentTrackIdx, setTrackIdx }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  const audioRef = useRef(null);
  const currentTrack = playlist[currentTrackIdx] || playlist[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      setCurrentTime(0);
      setDuration(0);
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIdx]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    sfx.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      handleNext();
    }
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    if (isShuffle) {
      const rand = Math.floor(Math.random() * playlist.length);
      setTrackIdx(rand);
    } else {
      setTrackIdx((currentTrackIdx + 1) % playlist.length);
    }
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    if (currentTrackIdx === 0) {
      setTrackIdx(playlist.length - 1);
    } else {
      setTrackIdx(currentTrackIdx - 1);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercentage = clickX / width;
    const newTime = newPercentage * duration;
    
    if (audioRef.current && isFinite(duration) && duration > 0) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
      />

      {/* MINI PLAYER BAR */}
      <div id="miniPlayer" className="fixed left-0 right-0 bottom-4 z-[60] flex justify-center">
        <div
          onClick={() => {
            sfx.playOpenModal();
            setShowDetail(true);
          }}
          className="w-[94%] max-w-3xl rounded-3xl ios-blur shadow-lg border border-gray-200/50 dark:border-gray-800/50 p-2 cursor-pointer ios-button"
        >
          <div className="flex items-center gap-3 px-2 py-1">
            <img
              src={currentTrack.cover}
              alt="cover"
              className="w-12 h-12 rounded-lg object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                {currentTrack.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentTrack.artist}
              </div>
              <div className="h-1 rounded-full mt-2 overflow-hidden bg-gray-200 dark:bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
              >
                <i className="ri-skip-back-mini-line"></i>
              </button>
              <button
                onClick={handlePlayPause}
                className="p-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm flex items-center justify-center"
              >
                <i className={isPlaying ? "ri-pause-line" : "ri-play-line"}></i>
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
              >
                <i className="ri-skip-forward-mini-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULL CARD MODAL OVERLAY */}
      {showDetail && (
        <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              sfx.playClick();
              setShowDetail(false);
            }}
          />

          <div className="relative w-full sm:max-w-md ios-blur ios-sheet sm:rounded-3xl p-6 z-10 border border-gray-200/50 dark:border-gray-800/50 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                sfx.playClick();
                setShowDetail(false);
              }}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-all text-gray-600 dark:text-gray-400"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center mt-6">
              <img
                src={currentTrack.cover}
                alt="cover"
                className="w-56 h-56 rounded-2xl object-cover shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300 border dark:border-gray-800"
              />
              
              <h3 className="text-xl font-bold truncate w-full text-gray-900 dark:text-gray-100">
                {currentTrack.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6 w-full truncate">
                {currentTrack.artist}
              </p>

              {/* Seekbar */}
              <div
                onClick={handleSeek}
                className="relative w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full cursor-pointer mb-2"
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-primary shadow-lg"
                  style={{ left: `calc(${progressPercent}% - 9px)` }}
                />
              </div>
              
              <div className="flex justify-between w-full text-xs text-gray-500 mb-6 font-semibold">
                <div>{formatTime(currentTime)}</div>
                <div>{formatTime(duration)}</div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsShuffle(!isShuffle);
                  }}
                  className={`text-lg p-2 transition-all ${
                    isShuffle ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <i className="ri-shuffle-line"></i>
                </button>
                
                <button
                  onClick={handlePrev}
                  className="text-2xl p-2 text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all"
                >
                  <i className="ri-skip-back-mini-line"></i>
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-2xl"
                >
                  <i className={isPlaying ? "ri-pause-line" : "ri-play-line"}></i>
                </button>
                
                <button
                  onClick={handleNext}
                  className="text-2xl p-2 text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all"
                >
                  <i className="ri-skip-forward-mini-line"></i>
                </button>
                
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsRepeat(!isRepeat);
                  }}
                  className={`text-lg p-2 transition-all ${
                    isRepeat ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <i className="ri-repeat-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
