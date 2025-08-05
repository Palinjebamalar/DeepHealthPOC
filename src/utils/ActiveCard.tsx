import React from "react";
// import Card from '@mui/material/Card';
import { CardContent,Card,CardMedia,Typography,Button, CardActionArea, CardActions  } from "@mui/material";
import '../App.css';
type Props = {
    pan:number;
    src:string;
}
const ActiveCard: React.FC<Props> = ({pan,src}) => {
    return(
        <Card    sx={{
            minHeight: 150,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 6,
            },
          }}>
            <CardActionArea>
            <CardMedia
          component="video"
          controls
          src={src}
          height="180"
          sx={{ objectFit: "cover" }}
        />
                <CardContent>
                    <Typography gutterBottom variant="h5" component='div'>
                   {pan}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        This is {pan}.
                    </Typography>
                </CardContent>
            </CardActionArea>

        </Card>
     
    )
}

export default ActiveCard;