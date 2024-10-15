import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import React, { useState, useEffect } from "react";

const PRESET_CONFIGS = {
  instagramReels: { width: 1080, height: 1920 },
  tiktok: { width: 1080, height: 1920 },
  youtubeShorts: { width: 1080, height: 1920 },
  instagram1x1: { width: 1080, height: 1080 },
  instagram4x5: { width: 1080, height: 1350 },
  instagram16x9: { width: 1920, height: 1080 },
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  select: {
    marginBottom: '20px',
  },
  button: {
    marginRight: '10px',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export const RemotionRoot: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState("instagramReels");
  const [videoSrc, setVideoSrc] = useState("");
  const [subtitles, setSubtitles] = useState([
    { start: 0, end: 2, text: "Hello, world!" },
    { start: 2, end: 4, text: "This is a sample subtitle." },
  ]);
  const [assets, setAssets] = useState<string[]>([]);
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setServerReady(true);
        } else {
          setTimeout(checkServer, 1000); // Retry after 1 second
        }
      } catch (error) {
        setTimeout(checkServer, 1000); // Retry after 1 second
      }
    };

    checkServer();
  }, []);

  useEffect(() => {
    if (serverReady) {
      fetchAssets();
    }
  }, [serverReady]);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleFileImport = () => {
    // Implement file import logic here
  };

  const handleSubtitlesImport = () => {
    // Implement subtitles import logic here
  };

  const handleExport = () => {
    // Implement export logic here
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Remotion Video Creator</h1>
      <select
        style={styles.select}
        value={selectedPreset}
        onChange={(e) => setSelectedPreset(e.target.value)}
      >
        {Object.keys(PRESET_CONFIGS).map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
      </select>
      <button style={styles.button} onClick={handleFileImport}>
        Import Video
      </button>
      <button style={styles.button} onClick={handleSubtitlesImport}>
        Import Subtitles
      </button>
      <button style={styles.button} onClick={handleExport}>
        Export Video
      </button>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={300}
        fps={30}
        width={PRESET_CONFIGS[selectedPreset as keyof typeof PRESET_CONFIGS].width}
        height={PRESET_CONFIGS[selectedPreset as keyof typeof PRESET_CONFIGS].height}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
          videoSrc,
          subtitles,
        }}
      />
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
    </div>
  );
};