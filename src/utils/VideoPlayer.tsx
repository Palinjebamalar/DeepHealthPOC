import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  AppBar,
  Toolbar
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface VideoPlayerProps {
  src: string;
  title?: string;
  fillContainer?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = 'Video Player',
  fillContainer = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleDoubleClick = () => {
    toggleFullscreen();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
      ref={containerRef}
    >
      {/* Top Nav Bar - Outside of video */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1">{currentTime}</Typography>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {title}
          </Typography>
          <IconButton color="inherit" onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Video Box below nav */}
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          controls={false}
          autoPlay
          muted
          loop
          onDoubleClick={handleDoubleClick}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    </Paper>
  );
};

export default VideoPlayer;
