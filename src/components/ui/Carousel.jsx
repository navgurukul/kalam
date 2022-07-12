import { makeStyles } from "@mui/styles";
// import { Box } from "@mui/system";
import React from "react";
import Slider from "react-slick";

// const width = Math.min(600, window.screen.width);

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  slider: {
    maxWidth: 400,
    margin: "0 auto",
    padding: "1.2rem 0",
    [theme.breakpoints.up("sm")]: {
      maxWidth: 400,
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: 600,
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: 600,
    },
  },
  title: {
    marginLeft: theme.spacing(2),
  },
}));

const Carousel = ({ images }) => {
  const classes = useStyles();
  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div style={{ width: "100%" }}>
      <Slider {...settings} className={classes.slider}>
        {images.map((el) => (
          // <Box
          //   key={el.label}
          //   maxWidth={width}
          //   style={{ margin: "0 auto", position: "relative", padding: 0 }}
          //   value={el.imageUrl}
          // >
          <img
            // maxWidth={width}
            alt={el.label}
            key={el.label}
            loading="lazy"
            src={`${el.imageUrl}`}
            style={{ maxWidth: "100%", borderRadius: "0.4rem" }}
          />
          // {/* <Box py={1} style={{ fontSize: 18, textAlign: "center" }}>
          //   <span align="center">{ele.label[language]}</span>
          // </Box> */}
          // </Box>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
