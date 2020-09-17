import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { getAllEvent } from "../api";
import { withRouter } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    minHeight: "100vh",
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
});

const MAX_LENGTH = 99;

const EventList = (props) => {
  const classes = useStyles();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    const rep = async () => {
      const res = await getAllEvent().catch((e) => {
        console.log(e.message);
      });
      setEvents(res);
    };
    rep();
  }, []);

  const handleToEventPage = (id) => {
    props.history.push(`/event/${id}`);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        <Header />
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">
          視聴開始
        </Typography>
        {events.map((event) => (
          <Card className={classes.card} key={event.id}>
            <CardActionArea onClick={() => handleToEventPage(event.id)}>
              <CardMedia
                className={classes.media}
                image={event.image_url}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.company.name}
                </Typography>
                <Typography variant="body2" component="p">
                  開催時間：{event.start_time}
                </Typography>
                <Typography
                  className={classes.introduction}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  {event.introduction.length > MAX_LENGTH
                    ? event.introduction.substr(0, MAX_LENGTH) + "..."
                    : event.introduction}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default withRouter(EventList);
