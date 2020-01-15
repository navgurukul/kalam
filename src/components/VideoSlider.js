import React from 'react';
import Box from '@material-ui/core/Box';

import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import YouTube from 'react-youtube';

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
      activeStep: 0
    }
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  timer = () => {
    this.setState({
      activeStep: (this.state.activeStep + 1) % aboutNavgurukul.length
    })
  }

  componentDidMount() {
    window.setInterval(this.timer, 5000)
  }

  render() {
    const width = Math.min(600, window.screen.width);
    const opts = {
      height: Math.floor(width * 9 / 16),
      width: width,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      },
      origin: window.location.origin,
    };

    return <Box maxWidth={width} style={{ margin: 'auto' }}>
      <YouTube
        videoId={aboutNavgurukul[this.state.activeStep].videoId}
        opts={opts}
        onReady={this._onReady}
      />
      <Box py={2} display="flex" style={{ flexDirection: 'column', alignItems: 'center', fontSize: 18, justifyContent: 'column' }}>
        <span>{aboutNavgurukul[this.state.activeStep].label.hi}</span>
        <span><b>{aboutNavgurukul[this.state.activeStep].label.en}</b></span>
      </Box>
      <MobileStepper
        variant="dots"
        steps={aboutNavgurukul.length}
        position="static"
        activeStep={this.state.activeStep}
        nextButton={
          <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === aboutNavgurukul.length - 1}>
            Next
          <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  }
}

export default VideoSlider;