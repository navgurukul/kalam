import React from "react";
import {
  Box,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Slider from "react-slick";
import { makeStyles } from "@mui/styles";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import YouTube from "react-youtube";
import playIcon from "../../assets/img/playicon.png";

const settings = {
  dots: false,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Transition = React.forwardRef((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Slide direction="up" ref={ref} {...props} />
));

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  slider: {
    maxWidth: 400,
    margin: "0 auto",
    padding: "1.2rem",
    [theme.breakpoints.up("sm")]: {
      maxWidth: 400,
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: 600,
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: 720,
    },
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    backgroundColor: "#000 !important",
  },
  playIcon: {
    position: "absolute",
    cursor: "pointer",
    [theme.breakpoints.up("md")]: {
      top: "calc(50% - 70px)",
      width: 120,
      left: "calc(50% - 65px)",
    },
    [theme.breakpoints.down("md")]: {
      top: "calc(50% - 60px)",
      width: 60,
      left: "calc(50% - 30px)",
    },
  },
}));

const aboutNavgurukul = [
  {
    label: {
      hi: "नवगुरुकुल क्या है २ मिनट मे समजे!",
      en: "2 mins introduction to NavGurukul",
    },
    videoId: "HjqfZ-Matyk",
  },
  {
    label: {
      hi: "नवगुरुकुल के कोफाउंडर अभिषेक का इंटरव्यू",
      en: "Interview of Abhishek, co-founder of Navgurukul",
    },
    videoId: "NC2ymm6Sots",
  },
  {
    label: {
      hi: "नवगुरुकुल अच्छे से एक्सप्लेन किया हुआ",
      en: "Detailed explanation about Navgurukul",
    },
    videoId: "sfU1m8MuZ5Y",
  },
  {
    label: {
      hi: "नवगुरुकुल से ग्रदुएटेड स्टूडेंट से सुनिए उनका एक्सपीरियंस",
      en: "Experience of Navgurukul Alumni & Graduates",
    },
    videoId: "vuSwndj5cbs",
  },
];

// var PrevArrow = React.createClass({
//   render(){
//     return (<IconButton className="slickArrowPrev" onClick={this.props.onClick} iconClassName="fa fa-chevron-circle-left" />)
//   }
// })

window.mobileAndTabletCheck = function mobileAndTabletCheck() {
  let check = false;
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      // eslint-disable-next-line no-useless-escape
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

const VideoSlider = ({ language, customLinks }) => {
  const classes = useStyles();
  const [videoDialog, setVideoDialog] = React.useState({
    open: false,
    selectedVideoID: null,
    selectedHeadline: null,
  });

  const handleClickOpen = (event) => {
    if (window.mobileAndTabletCheck()) {
      window.open(
        `https://www.youtube.com/watch?v=${event.currentTarget.dataset.video_id}`
      );
    } else {
      setVideoDialog({
        open: true,
        selectedVideoID: event.currentTarget.dataset.video_id,
        selectedHeadline: event.currentTarget.dataset.video_headline,
      });
    }
  };

  const handleClickClose = () => {
    setVideoDialog({
      open: false,
      selectedHeadline: null,
      selectedVideoID: null,
    });
  };

  const onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  };

  const width = Math.min(600, window.screen.width);
  // const width = window.screen.width;

  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w < (16 / 9) * h) {
    h = Math.floor((9 / 16) * w);
  } else {
    w = Math.floor((16 / 9) * h);
  }

  const opts = {
    width: w,
    height: h,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
    origin: window.location.origin,
  };

  const links = customLinks || aboutNavgurukul;

  return (
    <div style={{ width: "100%" }}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Slider {...settings} className={classes.slider}>
        {links.map((ele) => (
          <div key={ele.videoId}>
            <Box
              maxWidth={width}
              style={{ margin: "0 auto", position: "relative", padding: 0 }}
              onClick={handleClickOpen}
              value={ele.videoId}
              // arrows={true}
              data-video_id={ele.videoId}
              data-video_headline={ele.label[language]}
            >
              <img
                alt={ele.label}
                loading="lazy"
                src={`https://img.youtube.com/vi/${ele.videoId}/maxresdefault.jpg`}
                style={{ maxWidth: "100%", borderRadius: "0.4rem" }}
              />
              <img alt="play" src={playIcon} className={classes.playIcon} />
              <Box py={1} style={{ fontSize: 18, textAlign: "center" }}>
                <span align="center">{ele.label[language]}</span>
              </Box>
            </Box>
          </div>
        ))}
      </Slider>
      <Dialog
        fullScreen
        open={videoDialog.open}
        onClose={handleClickClose}
        TransitionComponent={Transition}
        classes={{ paper: classes.paper }}
      >
        <>
          <AppBar className={classes.appBar}>
            <Toolbar onClick={handleClickClose}>
              <Box
                display="flex"
                style={{
                  justifyContent: "space-between",
                  cursor: "pointer",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box
                  display="flex"
                  style={{ justifyContent: "flex-start", alignItems: "center" }}
                >
                  <IconButton edge="start" color="inherit" aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    Close
                  </Typography>
                </Box>
                <Typography variant="h6" className={classes.title}>
                  {videoDialog.selectedHeadline}
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Box style={{ margin: "0 auto" }}>
            <YouTube
              videoId={videoDialog.selectedVideoID}
              opts={opts}
              onReady={onReady}
            />
          </Box>
        </>
      </Dialog>
    </div>
  );
};

export default VideoSlider;
