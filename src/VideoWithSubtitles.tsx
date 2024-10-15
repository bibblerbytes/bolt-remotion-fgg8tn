import React from 'react';
import { AbsoluteFill, useVideoConfig, Video, Sequence } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface VideoWithSubtitlesProps {
  videoSrc: string;
  subtitles: Subtitle[];
}

export const VideoWithSubtitles: React.FC<VideoWithSubtitlesProps> = ({ videoSrc, subtitles }) => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const audioData = useAudioData(videoSrc);

  const subtitleStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 5px black',
  };

  if (!videoSrc) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>No video selected</h2>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <Video src={videoSrc} />
      {subtitles.map((subtitle, index) => (
        <Sequence
          key={index}
          from={Math.floor(subtitle.start * fps)}
          durationInFrames={Math.floor((subtitle.end - subtitle.start) * fps)}
        >
          <div style={subtitleStyle}>{subtitle.text}</div>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};