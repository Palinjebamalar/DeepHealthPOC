import React from "react";
import Grid from '@mui/material/GridLegacy';
import ActiveCard from "../utils/ActiveCard";
import VideoPlayer from "../utils/VideoPlayer";
import '../App.css';
import { useSearchParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";

const Details = () => {
  const [searchParams] = useSearchParams();
  const videosParam = searchParams.get("videos");

  let selectedVideos: string[] = [];
  try {
    const decoded = videosParam ? atob(videosParam) : "";
    selectedVideos = decoded ? decoded.split(",") : [];
  } catch (error) {
    console.error("Invalid Base64 videos param", error);
  }
  return (
    <Grid container spacing={2}>
      {selectedVideos.map((name, idx) => (
        <Grid item xs={12} sm={6} key={idx}>
          <Box display="flex" height={500} border={1}>
            {/* Left: Modality View */}
            <Box flex={2} borderRight={1} borderColor="skyblue" p={1}>
              {/* <Typography variant="subtitle2" color="primary">
                Modality View
              </Typography> */}
              <VideoPlayer
                src={`http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${name}.mp4`}
                title={name}
              />
            </Box>

            {/* Right: 3 stacked views */}
            <Box flex={1} display="none" flexDirection="column" >
              <Box flex={1} borderBottom={1} borderColor="red" p={1}>
                <Typography variant="body2">Lab Video 1</Typography>
                {/* <VideoPlayer src={`...`} title="Lab" /> */}
              </Box>
              <Box flex={1} borderBottom={1} borderColor="red" p={1}>
                <Typography variant="body2">Audio Video Link</Typography>
                {/* <VideoPlayer src={`...`} title="Audio" /> */}
              </Box>
              <Box flex={1} p={1}>
                <Typography variant="body2">Patient View</Typography>
                {/* <VideoPlayer src={`...`} title="Patient View" /> */}
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Details;
