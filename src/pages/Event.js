import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import { getEvent } from "../api";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MAX_LENGTH = 99;

const Event = () => {
  const useStyles = makeStyles({
    wrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      minHeight: "100vh",
    },
    root: {
      height: 480,
    },
    title: {
      marginTop: 32,
    },
    card: {
      maxWidth: 600,
      margin: "40px auto",
    },
    media: {
      height: 280,
    },
    introduction: {
      marginTop: 24,
    },
    enterButton: {
      marginBottom: 32,
    },
    footer: {
      width: "100%",
      position: "absolute",
      bottom: 0,
    },
    hiddenButton: {
      margin: "0 auto",
      width: 200,
    },
  });

  const classes = useStyles();
  const { event_id } = useParams();
  // const [companyName, setCompanyName] = useState(null);
  // const [startTime, setStartTime] = useState(null);
  // const [imageUrl, setImageUrl] = useState(null);
  // const [broadcastPath, setBroadcastPath] = useState(null);
  // const [viewerPath, setViewerPath] = useState(null);
  // const [introduction, setIntroduction] = useState(null);

  // TODO: 複数回呼ばれてしまう
  // useEffect(() => {
  //   const rep = async () => {
  //     const response = await getEvent(event_id).catch((e) => {
  //       console.log(e.message);
  //     });
  //     setCompanyName(response.company.name);
  //     setStartTime(response.start_time);
  //     setImageUrl(response.image_url);
  //     if (response.introduction.length > MAX_LENGTH) {
  //       setIntroduction(response.introduction.substr(0, MAX_LENGTH) + "...");
  //     } else {
  //       setIntroduction(response.introduction);
  //     }
  //     setViewerPath(`/event/${event_id}/viewer`);
  //     setBroadcastPath(`/event/${event_id}/broadcast`);
  //   };
  //   rep();
  // }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        <Header />
        <Typography
          className={classes.title}
          gutterBottom
          variant="h5"
          component="h2"
        >
          skyway-try
        </Typography>
        {/* <Card className={classes.card} key={event_id}> */}
        {/* <CardMedia
            className={classes.media}
            component="img"
            src={imageUrl}
            title="Contemplative Reptile"
          /> */}
        {/* <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              skyway-try
            </Typography>
            <Typography variant="body2" component="p">
              skyway-try
            </Typography>
            <Typography
              className={classes.introduction}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              skyway-try
            </Typography>
          </CardContent> */}
        {/* </Card> */}

        <Button
          className={classes.enterButton}
          href="/event/1/viewer"
          variant="contained"
          color="primary"
        >
          go skyway-try!
        </Button>
        {/*
        <Button href={broadcastPath} variant="contained" color="primary">
          配信ボタン
        </Button>
        */}
      </div>
      {/* <div className={classes.footer}> */}
      {/* <Footer /> */}
      {/* </div> */}
      {/* <Button */}
      {/* className={classes.hiddenButton} */}
      {/* href={`/event/${event_id}/broadcast`} */}
      {/* > */}
      {/* All Rights Reserved */}
      {/* </Button> */}
    </div>
  );
};

export default Event;
