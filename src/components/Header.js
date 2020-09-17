import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  eventList: {
    color: "#fff",
    textDecoration: "none",
  },
  eventListButton: {
    color: "#fff",
    marginLeft: 8,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Link to="/skyway-try" className={classes.eventList}>
            <Typography variant="h6" color="inherit">
              skyway-try
            </Typography>
          </Link>
          {/* <Link to="/event" className={classes.eventList}> */}
          {/* <Button className={classes.eventListButton}>skyway-try</Button> */}
          {/* </Link> */}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
