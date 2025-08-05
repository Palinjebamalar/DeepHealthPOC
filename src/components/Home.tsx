import React, { useState } from "react";
import { Checkbox, FormControlLabel, Button } from "@mui/material";
import { videoSource } from "../utils/Constant";


const Home = () => {

  const [selected, setSelected] = useState<string[]>([]);
  const [unSelected,setUnselected] = useState<string[]>([]);

  // const videoSource = [
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  //   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
  // ];

  // const videoSource = [
  //   { id: 1, name: "BigBuckBunny", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  //   { id: 2, name: "ElephantsDream", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
  //   { id: 3, name: "ForBiggerBlazes", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  //   { id: 4, name: "ForBiggerEscapes", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  //   { id: 5, name: "ForBiggerFun", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  //   { id: 6, name: "ForBiggerJoyrides", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  //   { id: 7, name: "ForBiggerMeltdowns", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
  //   { id: 8, name: "Sintel", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  //   { id: 9, name: "SubaruOutbackOnStreetAndDirt", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
  //   { id: 10, name: "TearsOfSteel", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
  //   { id: 11, name: "VolkswagenGTIReview", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4" },
  //   { id: 12, name: "WeAreGoingOnBullrun", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" },
  //   { id: 13, name: "WhatCarCanYouGetForAGrand", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4" }
  // ];
  

  const names = videoSource.map(url => {
    
    return url.name;
  });

  const handleCheckboxChange = (name: string) => {
    setSelected(prev => {
      // Already selected, so remove it
      if (prev.includes(name)) {
        return prev.filter(item => item !== name);
      }
  
      // Not selected yet, but max limit reached
      if (prev.length >= 12) {
        alert("You can select a maximum of 12 videos.");
        return prev;
      }
  
      // Add new selection
      return [...prev, name];
    });
  };
  

  // const handleSubmit = () => {
  //   const query = new URLSearchParams({ videos: selected.join(",") }).toString();
  //   const url = `${window.location.origin}/detail?${query}`;
  //   window.open(url, "_blank", "width=900,height=600");
  //   // var win1 = window.open(...);
  // };

  // const handleSubmit = () => {
  //   const groupSize = 4;
  //   const groups = [];
  
  //   for (let i = 0; i < selected.length; i += groupSize) {
  //     groups.push(selected.slice(i, i + groupSize));
  //   }
  
  //   groups.forEach((group, index) => {
  //     const query = new URLSearchParams({ videos: group.join(",") }).toString();
  //     const url = `${window.location.origin}/detail?${query}`;
  //     window.open(
  //       url,
  //       `_blank${index}`, // Use a unique name for each window
  //       "width=1200,height=800"
  //     );
  //   });
  // };
  
  const handleSubmit = () => {
    const groupSize = 4;
  
    // Step 1: Group videos in chunks of 4
    const groups: string[][] = [];
    for (let i = 0; i < selected.length; i += groupSize) {
      groups.push(selected.slice(i, i + groupSize));
    }
  
      // Utility to encode videos to base64
  const encodeBase64 = (videos: string[]) => {
    const joined = videos.join(",");
    return btoa(joined); // Encode as base64
  };
    // Step 2: Logic for number of windows to open
    if (selected.length > 8) {
      // Open all windows immediately
      groups.forEach((group, index) => {
        const encoded = encodeBase64(group);    
        const url = `${window.location.origin}/detail?videos=${encoded}`;
        window.open(url, `_blank${index}`, "width=1200,height=800");
      });
    } else {
      // Open 2 windows at a time with small delay
      const maxAtOnce = 2;
      const delayBetweenBatches = 1000;
  
      const openBatches = async () => {
        for (let i = 0; i < groups.length; i += maxAtOnce) {
          const batch = groups.slice(i, i + maxAtOnce);
          batch.forEach((group, index) => {
            const encoded = encodeBase64(group);
            const url = `${window.location.origin}/detail?videos=${encoded}`;
            window.open(url, `_blank${i + index}`, "width=1200,height=800");
          });
  
          if (i + maxAtOnce < groups.length) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
          }
        }
      };
  
      openBatches();
    }
  };
  

  return (
    <>


      {/* Checkboxes */}
      <div style={{ marginLeft: 16 }}>
        {names.map((name, index) => (
            <div key={index} > 
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selected.includes(name)}
                onChange={() => handleCheckboxChange(name)}
                disabled={!selected.includes(name) && selected.length >= 12}
              />
            }
            label={name}
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
