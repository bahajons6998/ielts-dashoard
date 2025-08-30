import React, { useState, useRef } from 'react';
import { IAudio } from './ListeningTypes';

interface AudioUploaderProps {
  initialAudio: IAudio;
  onAudioChange: (audio: { url: string; fileName: string }) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ initialAudio, onAudioChange }) => {
  const [audio, setAudio] = useState<IAudio>(initialAudio);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload the file to a server here
    // For now, we'll create a local URL
    const audioUrl = URL.createObjectURL(file);
    
    const audioData = {
      url: audioUrl,
      fileName: file.name
    };
    
    setAudio(prev => ({
      ...prev,
      url: audioUrl,
      fileName: file.name
    }));
    
    onAudioChange(audioData);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="audio-uploader">
      <div className="audio-controls">
        {audio.url && (
          <>
            <button
              type="button"
              className="play-pause-btn"
              onClick={handlePlayPause}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span className="file-name">{audio.fileName}</span>
            <audio
              ref={audioRef}
              src={audio.url}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
      
      <div className="upload-controls">
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="upload-btn"
          onClick={handleUploadClick}
        >
          {audio.url ? 'Change Audio' : 'Upload Audio'}
        </button>
      </div>
      
      <p className="file-details">
        {audio.url 
          ? `Current file: ${audio.fileName}` 
          : 'No audio file selected'}
      </p>
    </div>
  );
};

export default AudioUploader;