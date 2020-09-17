import React, { useEffect } from "react";
import Peer from "skyway-js";
import { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SpeakerNotesIcon from "@material-ui/icons/SpeakerNotes";
import SpeakerNotesOffIcon from "@material-ui/icons/SpeakerNotesOff";
import TelegramIcon from "@material-ui/icons/Telegram";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import { getEvent } from "../api";
import { isUseWidth, STANDARD_HEIGHT, STANDARD_WIDTH } from "../utils/useWidth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/broadcast.css";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    minHeight: "100vh",
  },
  eventInfo: {
    margin: "24px 0",
  },
  action: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    padding: 4,
    margin: "0 auto",
  },
  messageField: {
    backgroundColor: "#fff",
    width: "100%",
    margin: "0 4px",
  },
  messageButton: {
    marginLeft: 8,
  },
  root: {
    marginBottom: 64,
  },
});

const MAX_LENGTH = 25;

const nicoJSLib = require("nicojs");
const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_API_KEY });

const Viewer = () => {
  const classes = useStyles();
  const { event_id } = useParams();
  const remoteVideo = useRef(null);
  const [room, setRoom] = useState(null);
  const [nicoJS, setNicoJS] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [numPeople, setNumPeople] = useState(0);
  const [message, setMessage] = useState("");
  const [isDisplayComment, setIsDisplayComment] = useState(true);
  const [isViewing, setIsViewing] = useState(false);
  const [lastSnedMsgTime, setLastSnedMsgTime] = useState(
    new Date("2020/01/01 00:00:00")
  );

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

  // コメントの流す速さも決定, 3秒で流す想定
  const flowSpeed = useWidth / 80;

  // useEffect(() => {
  //   const rep = async () => {
  //     const response = await getEvent(event_id).catch((e) => {
  //       console.log(e.message);
  //     });
  //     setCompanyName(response.company.name);
  //     setStartTime(response.start_time);
  //   };
  //   rep();
  // }, []);

  const joinRoom = () => {
    const sfuRoom = peer.joinRoom("test", {
      mode: "sfu",
    });
    setRoom(sfuRoom);
    sfuRoom.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
      // 退室者が発生した
      sfuRoom.on("peerLeave", (peerId) => {
        if (peerId === remoteStream.peerId) {
          sfuRoom.close();
          setNumPeople(0);
          remoteVideo.current.srcObject = null;
          // TODO: 配信終了しましたみないな画像？を表示したい
        } else {
          setNumPeople(sfuRoom.members.length);
        }
      });
    });

    const nico = new nicoJSLib({
      app: document.getElementById("screen"),
      width: useWidth,
      height: useHeight,
      font_size: 36,
      speed: 8,
      color: "#fff",
    });
    setNicoJS(nico);
    nico.listen();

    // コメントを受信した時に実行
    sfuRoom.on("data", ({ src, data }) => {
      console.log(src, data);

      // 25文字以上のコメントを弾く
      if (data.length < MAX_LENGTH) {
        nico.send({ text: data, speed: flowSpeed });
      }
    });

    // 新しい人が参加した時
    sfuRoom.on("peerJoin", (peerId) => {
      setNumPeople(sfuRoom.members.length);
    });

    // 参加したタイミング
    sfuRoom.on("open", () => {
      setNumPeople(sfuRoom.members.length);
    });

    setIsViewing(true);
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

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.length > MAX_LENGTH) {
      alert("25文字以内で入力してください。");
      return;
    }
    if (room === null) {
      return;
    }
    const now = new Date();
    const diffTime = (now.getTime() - lastSnedMsgTime.getTime()) / 1000;
    if (diffTime < 5) {
      alert("数秒お待ち下さい");
      return;
    }
    room.send(message);
    document.getElementById("standard-basic").value = null;
    nicoJS.send({ text: message, speed: flowSpeed, color: "#ff0000" });
    setMessage("");
    setLastSnedMsgTime(now);
  };

  const leaveRoom = () => {
    if (room != null) {
      room.close();
      setIsViewing(false);
      setRoom(null);
    }
  };

  const videoWrapScreen = { width: useWidth + "px", height: useHeight + "px" };

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        {/* <Header /> */}
        {/* <div className={classes.eventInfo}>
          <Typography gutterBottom variant="h5" component="h2">
            会社名：{companyName}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            開始時間：{startTime}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            視聴人数：{numPeople}
          </Typography>
        </div> */}
        <div
          id="video-screen"
          style={
            room
              ? videoWrapScreen
              : Object.assign(videoWrapScreen, { backgroundColor: "#aaa" })
          }
        >
          <video
            id="video"
            className={classes.video}
            width={useWidth + "px"}
            height={useHeight + "px"}
            autoPlay
            playsInline
            ref={remoteVideo}
          ></video>
          <div id="comment-screen-wrap">
            <div id="screen"></div>
          </div>
        </div>
        <div className={classes.action}>
          {isViewing ? (
            <Button onClick={leaveRoom} variant="contained" color="primary">
              <PauseCircleOutlineIcon />
            </Button>
          ) : (
            <Button onClick={joinRoom} variant="contained" color="primary">
              <PlayCircleOutlineIcon />
            </Button>
          )}
          <TextField
            className={classes.messageField}
            value={message}
            onChange={handleChangeMessage}
            id="standard-basic"
            label="コメント(25文字以内)"
          />
          <Button onClick={sendMessage} variant="contained" color="primary">
            <TelegramIcon />
          </Button>
          {isDisplayComment ? (
            <Button
              className={classes.messageButton}
              onClick={displayHandle}
              variant="contained"
              color="primary"
              id="commentDisplayButton"
            >
              <SpeakerNotesOffIcon />
            </Button>
          ) : (
            <Button
              className={classes.messageButton}
              onClick={displayHandle}
              variant="contained"
              color="primary"
              id="commentDisplayButton"
            >
              <SpeakerNotesIcon className={classes.messageButton} />
            </Button>
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Viewer;
