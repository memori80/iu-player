import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const musicList = [
  {
    title: '밤 산책',
    src: '/audio/iu_1_short.mp3',
    cover: 'https://image.bugsm.co.kr/album/images/500/201408/20140801.jpg',
    author: '아이유',
    description: '폭싹 속았수다 OST',
    album: '밤 산책'
  },
  {
    title: 'Never Ending Story',
    src: '/audio/iu_2_short.mp3',
    cover: 'https://image.bugsm.co.kr/album/images/500/201908/20190801.jpg',
    author: '아이유',
    description: 'Hotel Del Luna OST',
    album: 'Hotel Del Luna OST Part.13'
  }
];

function App() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
  }, []);

  const playPause = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setPlaying(!playing);
  };

  const next = () => {
    if (shuffle) {
      let nextIdx = Math.floor(Math.random() * musicList.length);
      while (nextIdx === current && musicList.length > 1) {
        nextIdx = Math.floor(Math.random() * musicList.length);
      }
      setCurrent(nextIdx);
    } else {
      setCurrent((prev) => (prev + 1) % musicList.length);
    }
    setPlaying(false);
    setVolume(0.5);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.load();
      audioRef.current.oncanplaythrough = () => {
        audioRef.current?.play().then(() => {
          setPlaying(true);
        }).catch(error => {
          console.log("재생 실패:", error);
        });
      };
    }
  };

  const prev = () => {
    if (shuffle) {
      let prevIdx = Math.floor(Math.random() * musicList.length);
      while (prevIdx === current && musicList.length > 1) {
        prevIdx = Math.floor(Math.random() * musicList.length);
      }
      setCurrent(prevIdx);
    } else {
      setCurrent((prev) => (prev - 1 + musicList.length) % musicList.length);
    }
    setPlaying(false);
    setVolume(0.5);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.load();
      audioRef.current.oncanplaythrough = () => {
        audioRef.current?.play().then(() => {
          setPlaying(true);
        }).catch(error => {
          console.log("재생 실패:", error);
        });
      };
      
    }
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
    if (audioRef.current) {
      audioRef.current.volume = Number(e.target.value);
    }
  };

  const onProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    if (repeat) {
      audioRef.current?.play();
    } else {
      next();
    }
  };

  return (
    <div className="App">
      <div className="vibe-card">
        <div className="vibe-emoji">🎵</div>
        <div className="vibe-title">IU Music Player</div>
        <div className="vibe-desc">아이유의 음악을 즐겨보세요</div>
        
        <div className="book-info">
          <img 
            src={musicList[current].cover} 
            alt={musicList[current].title}
            className="book-cover"
          />
          <div className="book-details">
            <h3>{musicList[current].title}</h3>
            <p className="book-author">{musicList[current].author}</p>
            <p className="book-album">{musicList[current].album}</p>
            <p className="book-description">{musicList[current].description}</p>
          </div>
        </div>

        <div className="vibe-progress">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={onProgressChange}
            className="vibe-progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <div className="vibe-player">
          <div className="control-group">
            <button className="vibe-btn" onClick={prev} title="이전 곡">⏮️</button>
            <button className="vibe-btn play-btn" onClick={playPause} title="재생/일시정지">
              {playing ? '⏸️' : '▶️'}
            </button>
            <button className="vibe-btn" onClick={next} title="다음 곡">⏭️</button>
          </div>
          <div className="control-group">
            <button className={`vibe-btn ${repeat ? 'active' : ''}`} onClick={() => setRepeat(r => !r)} title="반복">
              🔁
            </button>
            <button className={`vibe-btn ${shuffle ? 'active' : ''}`} onClick={() => setShuffle(s => !s)} title="셔플">
              🔀
            </button>
          </div>
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              className="vibe-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={onVolume}
              title="볼륨"
            />
          </div>
          <audio
            ref={audioRef}
            src={musicList[current].src}
            onEnded={handleEnded}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
