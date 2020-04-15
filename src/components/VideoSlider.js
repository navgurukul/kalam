import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Slider from "react-slick";
import { withStyles } from '@material-ui/core/styles';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Dialog from '@material-ui/core/Dialog';
import YouTube from 'react-youtube';
import playIcon from '../assets/img/playIcon.png';
import Slide from '@material-ui/core/Slide';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    backgroundColor: "#000 !important"
  }
})

const aboutNavgurukul = [
  {
    label: {
      "hi": 'नवगुरुकुल क्या है २ मिनट मे समजे!',
      "en": "2 mins introduction to NavGurukul"
    },
    videoId: 'HjqfZ-Matyk',
  },
  {
    label: {
      "hi": 'नवगुरुकुल के कोफाउंडर अभिषेक का इंटरव्यू',
      "en": "Interview of Abhishek, co-founder of Navgurukul"
    },
    videoId: 'NC2ymm6Sots',
  },
  {
    label: {
      "hi": 'नवगुरुकुल अच्छे से एक्सप्लेन किया हुआ',
      "en": "Detailed explanation about Navgurukul"
    },
    videoId: 'sfU1m8MuZ5Y',
  },
  {
    label: {
      "hi": 'नवगुरुकुल से ग्रदुएटेड स्टूडेंट से सुनिए उनका एक्सपीरियंस',
      "en": "Experience of Navgurukul Alumni & Graduates"
    },
    videoId: 'vuSwndj5cbs',
  }];

export class VideoSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      open: false
    }
  }

  handleClickOpen = (event) => {
    this.setState({
      open: true,
      selectedVideoID: event.currentTarget.dataset.video_id,
      selectedHeadline: event.currentTarget.dataset.video_headline
    });
  }

  handleClickClose = () => {
    this.setState({
      open: false
    });
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }

  componentDidMount() {
  }

  render = () => {
    const { language, classes } = this.props;
    console.log(classes, this.props);

    const width = Math.min(600, window.screen.width);
    // const width = window.screen.width;

    var w = window.innerWidth;
    var h = window.innerHeight;
    if (w < 16 / 9 * h) {
      h = Math.floor(9 / 16 * w);
    } else {
      w = Math.floor(16 / 9 * h);
    }

    const opts = {
      width: w,
      height: h,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      },
      origin: window.location.origin,
    };

    return <>
      <Slider {...settings}>
        {aboutNavgurukul.map(ele => <div key={ele.videoId} >
          <Box maxWidth={width} style={{ margin: "0 auto", position: "relative" }} onClick={this.handleClickOpen} value={ele.videoId} data-video_id={ele.videoId} data-video_headline={ele.label[language]}>
            <img src={"https://img.youtube.com/vi/" + ele.videoId + "/maxresdefault.jpg"} style={{ maxWidth: "100%" }} />
            <img src={playIcon} style={{ position: "absolute", top: "calc(50% - 60px)", width: 120, cursor: "pointer", left: "calc(50% - 60px)" }} />
            <Box py={2} style={{ fontSize: 18, textAlign: "center" }}>
              <span align="center">{ele.label[language]}</span>
            </Box>
          </Box>
        </div>
        )}
      </Slider>
      <Dialog fullScreen open={this.state.open} onClose={this.handleClickClose} TransitionComponent={Transition} classes={{paper: classes.paper}}>
        <>
          <AppBar className={classes.appBar}>
            <Toolbar onClick={this.handleClickClose}>
              <Box display="flex" style={{ justifyContent: "space-between", cursor: "pointer", alignItems: "center", width: "100%" }}>
                <Box display="flex" style={{ justifyContent: "flex-start", alignItems: "center"}}>
                  <IconButton edge="start" color="inherit" aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    Close
                  </Typography>
                </Box>
                <Typography variant="h6" className={classes.title}>
                  {this.state.selectedHeadline}
                </Typography>
                <Typography variant="h6">
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Box style={{ margin: '0 auto' }}>
            <YouTube
              videoId={this.state.selectedVideoID}
              opts={opts}
              onReady={this._onReady}
            />
          </Box>
        </>
      </Dialog>
    </>
  }
}

export default withStyles(useStyles)(VideoSlider);