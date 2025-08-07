import React, { useState } from "react";
import { Checkbox, FormControlLabel, Button } from "@mui/material";
import { videoSource } from "../utils/Constant";

const Home = () => {
  const [selected, setSelected] = useState<number[]>([]);

  // const names = videoSource.map(url => {
  //   const parts = url.split('/');
  //   const filename = parts[parts.length - 1];
  //   return filename.replace('.mp4', '');
  // });

  const handleCheckboxChange = (name: number) => {
    setSelected(prev => {
      if (prev.includes(name)) {
        return prev.filter(item => item !== name);
      }
      if (prev.length >= 12) {
        alert("You can select a maximum of 12 videos.");
        return prev;
      }
      return [...prev, name];
    });
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      alert("Please select at least one video.");
      return;
    }

    const groupSize = 4;
    const groups: number[][] = [];
    for (let i = 0; i < selected.length; i += groupSize) {
      groups.push(selected.slice(i, i + groupSize));
    }

    // Unselected videos for potential addition
 const unselected = videoSource
  .filter(v => !selected.includes(v.id))
  .map(v => v.id);
    const encodeBase64 = (arr: number[]) => btoa(arr.join(","));

    const openWindow = (group: number[], extras: number[], index: number) => {
      const encodedVideos = encodeBase64(group);
      const encodedExtras = encodeBase64(extras);

      const url = new URL(`${window.location.origin}/detail`);
      url.searchParams.set("videos", encodedVideos);
      if (group.length < 4 && extras.length > 0) {
        url.searchParams.set("extras", encodedExtras);
      }
      window.open(url.toString(), `_blank${index}`, "width=1200,height=800");
    };

    if (selected.length > 8) {
      // Open all windows instantly
      groups.forEach((group, index) => {
        openWindow(group, unselected, index);
      });
    } else {
      // Open 2 at a time with delay
      const maxAtOnce = 2;
      const delayBetweenBatches = 1000;

      const openBatches = async () => {
        for (let i = 0; i < groups.length; i += maxAtOnce) {
          const batch = groups.slice(i, i + maxAtOnce);
          batch.forEach((group, j) => {
            openWindow(group, unselected, i + j);
          });

          if (i + maxAtOnce < groups.length) {
            await new Promise(res => setTimeout(res, delayBetweenBatches));
          }
        }
      };

      openBatches();
    }
  };

  return (
    <>
      <div style={{ marginLeft: 16 }}>
        {videoSource.map((value, index) => (
          <div key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.includes(value.id)}
                  onChange={() => handleCheckboxChange(value.id)}
                  disabled={!selected.includes(value.id) && selected.length >= 12}
                />
              }
              label={value.name}
            />
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
