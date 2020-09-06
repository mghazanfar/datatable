import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Skeleton from "@material-ui/lab/Skeleton";
import Axios from "axios";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBarBG: {
    backgroundColor: "rgb(25, 118, 210)",
  },
}));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CountryDetailDialog(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const { name } = props;
  const prevAmount = usePrevious(name);

  useEffect(() => {
    if (props.open && props.name !== prevAmount) {
      setDetails(null);
      setLoading(true);
      let url = `http://apiv3.iucnredlist.org/api/v3/species/narrative/${props.name}?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee`;
      Axios.get(url).then((res) => {
        let data = res.data.result[0];
        let elements = [];
        Object.entries(data).forEach(([key, value]) => {
          elements.push(
            <>
              <ListItem button>
                <ListItemText
                  primary={key.toLocaleLowerCase()}
                  secondary={
                    <div dangerouslySetInnerHTML={{ __html: `${value}` }} />
                  }
                  primaryTypographyProps={{
                    style: { textTransform: "capitalize" },
                  }}
                />
              </ListItem>
              <Divider />
            </>
          );
        });
        setDetails(elements);
        setLoading(false);
      });
    }
  }, [props.open, props.name]);

  const skeleton = (
    <Box p={4} pt={0}>
      <Skeleton variant="text" width={350} style={{ marginBottom: 8 }} />
      <Skeleton variant="rect" height={118} />
      <Divider style={{ marginBottom: 16, marginTop: 16 }} />
      <Skeleton variant="text" width={350} style={{ marginBottom: 8 }} />
      <Skeleton variant="rect" height={118} />
      <Divider style={{ marginBottom: 16, marginTop: 16 }} />
      <Skeleton variant="text" width={350} style={{ marginBottom: 8 }} />
      <Skeleton variant="rect" height={118} />
      <Divider style={{ marginBottom: 16, marginTop: 16 }} />
      <Skeleton variant="text" width={350} style={{ marginBottom: 8 }} />
      <Skeleton variant="rect" height={118} />
    </Box>
  );

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar position="sticky" className={classes.appBarBG}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {!loading ? (
            <Box p={4} pt={0}>
              {details}
            </Box>
          ) : (
            skeleton
          )}
        </List>
      </Dialog>
    </div>
  );
}
