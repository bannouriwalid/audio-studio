import '../styles/components/AudioPlayer.css';
import { useRef, useState } from "react";

type AudioPlayerProps = {
    src?: string;
};

const AudioPlayer = ({ src }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;

        const current = audio.currentTime;
        const dur = audio.duration;
        setProgress((current / dur) * 100);
        setCurrentTime(formatTime(current));
        setDuration(formatTime(dur));
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const playFromBeginning = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
    };

    const downloadAudio = () => {
        if (!src) return;
        const link = document.createElement('a');
        link.href = src;
        link.download = 'audio.wav';
        link.click();
    };

    return src ? (
        <div className="media-controls">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                hidden
            />
            <div className="media-buttons">
                {/* New: Play from beginning */}
                <button className="media-button" onClick={playFromBeginning}>
                    <i className="bi bi-skip-start-fill button-icons"></i>
                    <span className="bt-button-text">Restart</span>
                </button>
                <button
                    className="media-button"
                    onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}
                >
                    <i className="bi bi-skip-backward-fill button-icons"></i>
                    <span className="bt-button-text">Rewind</span>
                </button>

                <button className="media-button play-button" onClick={togglePlay}>
                    <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} button-icons`}></i>
                    <span className="bt-button-text">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                    className="media-button"
                    onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}
                >
                    <i className="bi bi-skip-forward-fill button-icons"></i>
                    <span className="bt-button-text">Forward</span>
                </button>

                {/* New: Download */}
                <button className="media-button" onClick={downloadAudio}>
                    <i className="bi bi-download button-icons"></i>
                    <span className="bt-button-text">Download</span>
                </button>
            </div>

            <div className="media-progress">
                <div className="progress-bar-wrapper">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-time-current">{currentTime}</div>
                <div className="progress-time-total">{duration}</div>
            </div>
        </div>
    ) : null;
};

export default AudioPlayer;
