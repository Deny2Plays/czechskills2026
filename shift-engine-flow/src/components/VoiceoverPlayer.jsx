import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

export default function VoiceoverPlayer({ url, title }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      updateProgress();
    }
    setPlaying(!playing);
  }

  function updateProgress() {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime / audioRef.current.duration || 0);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (!url) return null;

  return (
    <div className="flex items-center gap-4 p-4 rounded border border-border bg-secondary/30">
      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />

      <button
        onClick={togglePlay}
        className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors"
        aria-label={playing ? "Pozastavit" : "Přehrát"}
      >
        {playing ? (
          <Pause className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Volume2 className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground truncate">
            {title || "Voiceover"}
          </span>
        </div>
        {/* Waveform visualizer */}
        <div className="relative h-6 flex items-center gap-px">
          {Array.from({ length: 40 }).map((_, i) => {
            const height = 20 + Math.sin(i * 0.8) * 40 + Math.cos(i * 1.2) * 20;
            const isFilled = i / 40 <= progress;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-colors ${
                  isFilled ? "bg-primary" : "bg-border"
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono text-chrome">
            {formatTime((audioRef.current?.currentTime || 0))}
          </span>
          <span className="text-[10px] font-mono text-chrome">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}