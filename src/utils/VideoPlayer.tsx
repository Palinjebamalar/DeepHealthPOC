import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
type SubVideo = {
  id: number;
  url: string;
  name: string;
};
interface VideoPlayerProps {
  src: string;
  title?: string;
  fillContainer?: boolean;
  setIsDetail?: React.Dispatch<React.SetStateAction<boolean>>;
  subVideo: SubVideo[] | undefined;
}
const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [
    hrs > 0 ? String(hrs).padStart(2, "0") : null,
    String(mins).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
};
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = "Video Player",
  fillContainer = false,
  subVideo,
  setIsDetail,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [hideAll, setHideAll] = useState(false);
  const [data, setData] = useState<any>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenVideoIndex, setFullscreenVideoIndex] = useState<
    number | null
  >(null);
  const [playbackTime, setPlaybackTime] = useState<string>("00:00");
  const [shouldRestoreMainFullscreen, setShouldRestoreMainFullscreen] =
    useState(false);
  const toggleFullscreen = (index: number | null = null) => {
    const container =
      index === null
        ? containerRef.current
        : document.getElementById(`video-container-${index}`);

    if (container && !isFullscreen) {
      setIsFullscreen(true);
      container.requestFullscreen?.();
      setFullscreenVideoIndex(null);
    } else {
      setIsFullscreen(false);
      document?.exitFullscreen?.();
      setFullscreenVideoIndex(null);
    }
  };

  const toggleSubFullscreen = async (index: number, data: any) => {
    setHideAll(true);
    setData(data);
  };

  const handleRestoreMainFullscreen = () => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setShouldRestoreMainFullscreen(false);
      setFullscreenVideoIndex(null);
    }
  };
  useEffect(() => {
    const handleEsc = (event: { key: string }) => {
      console.log(event);
      if (event.key === "Escape") {
        console.log("Escape key pressed!");
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      if (!isNowFullscreen && fullscreenVideoIndex !== null) {
        // Exiting from gallery fullscreen
        setShouldRestoreMainFullscreen(true);
        setFullscreenVideoIndex(null);
      }

      setIsFullscreen(isNowFullscreen);
      setIsDetail?.(isNowFullscreen);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      setIsDetail?.(false);
    };
  }, [fullscreenVideoIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setPlaybackTime(formatTime(video.currentTime));
    };

    video.addEventListener("timeupdate", updateTime);
    return () => {
      video.removeEventListener("timeupdate", updateTime);
    };
  }, []);
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          // position: "relative",
          overflow: "hidden",
        }}
        ref={containerRef}
        id={`video-container-null`}
      >
        {!hideAll ? (
          <>
            {/* Top Nav Bar */}
            <AppBar
              position="static"
              sx={{
                backgroundColor: "#d9d9d9",
                color: "#000",
                // maxHeight: "34px !important",
                // minHeight: "34px !important",
                // height: "34px !important",
                ".MuiToolbar-root": {
                  minHeight: "10% !important",
                },
              }}
            >
              <Toolbar
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {playbackTime}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
                >
                  {title}
                </Typography>
                <IconButton onClick={() => toggleFullscreen(null)}>
                  {isFullscreen && fullscreenVideoIndex === null ? (
                    <FullscreenExitIcon />
                  ) : (
                    <FullscreenIcon />
                  )}
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Video Section */}
            <Box sx={{ flexGrow: 1, display: "flex", height: "90%" }}>
              {/* Main Video */}
              <video
                ref={videoRef}
                style={{
                  width: isFullscreen ? "70% !important" : "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "flex",
                  margin: "0 auto",
                }}
                controls={false}
                autoPlay
                muted
                loop
                onDoubleClick={() => toggleFullscreen(null)}
              >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Gallery shown only when main is fullscreen */}
              {isFullscreen && fullscreenVideoIndex === null && (
                <Box sx={{ width: "30%" }}>
                  <div className="gallery">
                    {subVideo?.map((value, index) => (
                      <Paper
                        key={index}
                        elevation={3}
                        sx={{
                          marginBottom: 1,
                          position: "relative",
                          overflow: "hidden",
                        }}
                        ref={(el) => {
                          popupRefs.current[index] =
                            el as HTMLDivElement | null;
                        }}
                        id={`video-container-${index}`}
                      >
                        <AppBar
                          position="static"
                          sx={{
                            backgroundColor: "#d9d9d9",
                            color: "#000",
                            ".MuiToolbar-root": {
                              minHeight: "24px !important",
                            },
                          }}
                        >
                          <Toolbar
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {playbackTime}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                flexGrow: 1,
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              Gallery Video
                            </Typography>
                            <IconButton
                              onClick={() => toggleSubFullscreen(index, value)}
                            >
                              {fullscreenVideoIndex === index ? (
                                <FullscreenExitIcon />
                              ) : (
                                <FullscreenIcon />
                              )}
                            </IconButton>
                          </Toolbar>
                        </AppBar>

                        <video
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                          controls={false}
                          autoPlay
                          muted
                          loop
                          onDoubleClick={() =>
                            toggleSubFullscreen(index, value)
                          }
                        >
                          <source src={value.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </Paper>
                    ))}
                  </div>

                  {shouldRestoreMainFullscreen && (
                    <Box textAlign="center" mt={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleRestoreMainFullscreen}
                      >
                        Return to Main Fullscreen
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Paper
            elevation={3}
            sx={{
              marginBottom: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <AppBar
              position="static"
              sx={{
                backgroundColor: "#d9d9d9",
                color: "#000",
                ".MuiToolbar-root": {
                  minHeight: "24px !important",
                },
              }}
            >
              <Toolbar
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {playbackTime}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {data.name}
                </Typography>
                <IconButton onClick={() => setHideAll(false)}>
                  <FullscreenIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            <video
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              controls={false}
              autoPlay
              muted
              loop
              onDoubleClick={() => setHideAll(false)}
            >
              <source src={data.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Paper>
        )}
      </Paper>
    </>
  );
};

export default VideoPlayer;
