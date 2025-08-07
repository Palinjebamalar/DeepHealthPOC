import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Modal,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import VideoPlayer from "../utils/VideoPlayer";
import "../App.css";
import { videoSource } from "../utils/Constant";

type SubVideo = {
  id: number;
  url: string;
  name: string;
};

type Video = {
  id: number;
  url: string;
  name: string;
  subVideos?: SubVideo[];
};

const Details = () => {
  const [searchParams] = useSearchParams();
  const [isDetail, setIsDetail] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

  // Decode initial video selection
  const videosParam = searchParams.get("videos");
  let initialVideos: Video[] = [];
  try {
    const decoded = videosParam ? atob(videosParam) : "";
    const ids = decoded ? decoded.split(",") : [];
    initialVideos = videoSource.filter((video) =>
      ids.includes(video.id.toString())
    );
  } catch (error) {
    console.error("Invalid Base64 videos param", error);
  }

  // Set up slots with selected videos and empty ones
  const [videos, setVideos] = useState<(Video | null)[]>(() => {
    const slots: (Video | null)[] = Array(4).fill(null);
    initialVideos.forEach((v, i) => {
      if (i < 4) slots[i] = v;
    });
    return slots;
  });

  // Decode available extras
  const extrasParam = searchParams.get("extras");
  let availableExtras: Video[] = [];
  try {
    const decodedExtras = extrasParam ? atob(extrasParam) : "";
    const rawExtras = decodedExtras ? decodedExtras.split(",") : [];
    availableExtras = videoSource.filter((video) =>
      rawExtras.includes(video.id.toString())
    );
  } catch (error) {
    console.error("Invalid Base64 extras param", error);
  }

  // Filter extras to exclude already selected videos
  const usedVideoIds = videos.filter(Boolean).map((v) => v!.id.toString());
  const filteredExtras = availableExtras.filter(
    (video) => !usedVideoIds.includes(video.id.toString())
  );

  // Modal open handler
  const handleOpenModal = (index: number) => {
    setActiveCardIndex(index);
    setModalOpen(true);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExtras([]);
    setActiveCardIndex(null);
  };

  // Add video to slot
  const handleAddExtras = () => {
    if (activeCardIndex === null || selectedExtras.length === 0) return;
    const selectedVideo = videoSource.find(
      (v) => v.id === selectedExtras[0]
    );
    if (!selectedVideo) return;

    const newVideos = [...videos];
    newVideos[activeCardIndex] = selectedVideo;
    setVideos(newVideos);
    handleCloseModal();
  };

  return (
    <>
      <Header />
      <Grid container gap={0}>
        {videos.map((video, index) => (
          <Grid  size={6} key={index}>
            <Box
              display="flex"
              height={500}
              border={1}
              sx={{ borderColor: video ? "#fff" : "#000" }}
            >
              {video ? (
                <Box flex={1} width="100%">
                  <VideoPlayer
                    src={video.url}
                    title={video.name}
                    setIsDetail={setIsDetail}
                    subVideo={video.subVideos || undefined}
                  />
                </Box>
              ) : (
                <Box
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(index)}
                  >
                    ➕ Add Video
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" mb={2}>
            Select a Video
          </Typography>

          {filteredExtras.length === 0 ? (
            <Typography>No more videos to add</Typography>
          ) : (
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                mb: 2,
                border: "1px solid #ccc",
                borderRadius: 1,
                p: 1,
              }}
            >
              <RadioGroup
                value={selectedExtras[0]?.toString() || ""}
                onChange={(e) =>
                  setSelectedExtras([parseInt(e.target.value)])
                }
              >
                {filteredExtras.map((video) => (
                  <FormControlLabel
                    key={video.id}
                    value={video.id.toString()}
                    control={<Radio />}
                    label={video.name}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={handleAddExtras}
              disabled={selectedExtras.length === 0}
              variant="contained"
            >
              Add Selected
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Details;
