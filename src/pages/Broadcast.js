import React from "react";
import Peer from "skyway-js";
import { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import FlipCameraIosIcon from "@material-ui/icons/FlipCameraIos";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { useParams } from "react-router-dom";
import { getEvent } from "../api";
import { isUseWidth, STANDARD_HEIGHT, STANDARD_WIDTH } from "../utils/useWidth";
import "../css/broadcast.css";

const nicoJSLib = require("nicojs");
const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_API_KE });

// css for material-ui
const useStyles = makeStyles({
  screen: {
    position: "relative",
    textAlign: "center",
  },
  camera: {
    position: "absolute",
    bottom: 3,
    right: 3,
  },
  playBtn: {
    position: "absolute",
    bottom: 3,
    left: 3,
  },
  eventInfo: {
    marginTop: 24,
  },
  commentBtn: {
    position: "absolute",
    left: "50%",
    bottom: 6,
    transform: "translateX(-50%)",
  },
});

const Broadcast = () => {
  const classes = useStyles();
  const { event_id } = useParams();
  const localVideo = useRef(null);
  const [room, setRoom] = useState(null);
  const [event, setEvent] = useState(null);
  const [mode, setMode] = useState(true);
  const [isDisplayComment, setIsDisplayComment] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  // 画面幅からビデオ幅を決定
  let useWidth;
  let useHeight;
  if (isUseWidth(innerHeight, innerWidth)) {
    useWidth = innerWidth;
    useHeight = (innerWidth * STANDARD_HEIGHT) / STANDARD_WIDTH;
  } else {
    useHeight = innerHeight;
    useWidth = (innerHeight * STANDARD_WIDTH) / STANDARD_HEIGHT;
  }

  // useEffect(() => {
  //   const rep = async () => {
  //     const response = await getEvent(event_id).catch((e) => {
  //       console.log(e.message);
  //     });
  //     setEvent(response);
  //   };
  //   rep();
  // }, []);
  const id = 1;
  const makeRoom = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 480 },
          height: { ideal: 270 },
          facingMode: mode ? "environment" : "user",
        },
        audio: false,
      })
      .then((stream) => {
        localVideo.current.srcObject = stream;
        const sfuRoom = peer.joinRoom("test", {
          mode: "sfu",
          stream: stream,
        });
        setRoom(sfuRoom);

        const nico = new nicoJSLib({
          app: document.getElementById("screen"),
          width: useWidth,
          height: useHeight,
          font_size: 36,
          speed: 8,
          color: "#fff",
        });
        nico.listen();

        // コメントを受信した時に実行
        sfuRoom.on("data", ({ src, data }) => {
          console.log(src, data);
          const flowSpeed = useWidth / 80; // 3秒で流す想定
          nico.send({ text: data, speed: flowSpeed });
        });
      });

    setIsBroadcasting(true);
  };

  const displayHandle = () => {
    if (isDisplayComment) {
      document.getElementById("screen").style.display = "none";
      setIsDisplayComment(false);
    } else {
      document.getElementById("screen").style.display = "block";
      setIsDisplayComment(true);
    }
  };

  const stopBroadcast = () => {
    if (room != null) {
      room.close();
      localVideo.current.srcObject = null;
      setRoom(null);
      // TODO: 配信終了しましたみたいな画像？を表示したい

      setIsBroadcasting(false);
    }
  };

  const changeCameraMode = () => {
    setMode((prev) => !prev);
    const cameraMode = !mode;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
          facingMode: cameraMode ? "environment" : "user",
        },
        audio: false,
      })
      .then((stream) => {
        room.replaceStream(stream);
        localVideo.current.srcObject = stream;
      });
  };
  const videoWrapScreen = { width: useWidth + "px", height: useHeight + "px" };

  return (
    <div>
      <div
        id="video-screen"
        className={classes.screen}
        style={
          isBroadcasting
            ? videoWrapScreen
            : Object.assign(videoWrapScreen, { backgroundColor: "#aaa" })
        }
      >
        <video
          id="video"
          width={useWidth + "px"}
          height={useHeight + "px"}
          autoPlay
          muted
          playsInline
          ref={localVideo}
        ></video>

        <div id="comment-screen-wrap">
          <div id="screen"></div>
        </div>

        {room !== null ? (
          <Fab
            color="primary"
            aria-label="add"
            onClick={changeCameraMode}
            className={classes.camera}
          >
            <FlipCameraIosIcon />
          </Fab>
        ) : (
          ""
        )}
      </div>
      {!isBroadcasting ? (
        <Fab color="primary" className={classes.playBtn} onClick={makeRoom}>
          <PlayCircleOutlineIcon />
        </Fab>
      ) : (
        <Fab
          color="secondary"
          className={classes.playBtn}
          onClick={stopBroadcast}
        >
          <PauseCircleOutlineIcon />
        </Fab>
      )}
      {isDisplayComment ? (
        <Button
          onClick={displayHandle}
          variant="contained"
          color="secondary"
          id="commentDisplayButton"
          className={classes.commentBtn}
        >
          コメント非表示
        </Button>
      ) : (
        <Button
          onClick={displayHandle}
          variant="contained"
          color="primary"
          id="commentDisplayButton"
          className={classes.commentBtn}
        >
          コメント表示
        </Button>
      )}
      {event !== null && (
        <div className={classes.eventInfo}>
          <Typography gutterBottom variant="h5" component="h2">
            会社名：{event.company.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            開始時間：{event.start_time}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Broadcast;
