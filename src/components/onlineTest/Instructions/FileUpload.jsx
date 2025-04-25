import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceUpload = () => {
  const [isFaceDetected, setIsFaceDetected] = useState(null);
  const imageRef = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgUrl = URL.createObjectURL(file);
    const imgEl = imageRef.current;

    // 1. Hook up the onload before setting src
    await new Promise((resolve, reject) => {
      imgEl.onload = () => resolve();
      imgEl.onerror = (err) => reject(err);
      imgEl.src = imgUrl;
    });

    // 2. (Optional) Pre-load models once, e.g. in a useEffect.
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

    // 3. Specify options so you know exactly what network is running
    const options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5,
      // inputSize: 300 // you can tweak this if you like
    });

    // 4. Now run detection on the fully-loaded image
    const detection = await faceapi.detectSingleFace(imgEl, options);
    setIsFaceDetected(!!detection);
  };

  return (
    <div>
      <h2>Face Detection Upload</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <img ref={imageRef} alt="" style={{ display: "none" }} />
      {isFaceDetected !== null && (
        <p>
          {isFaceDetected ? "✅ Human face detected!" : "❌ No face found."}
        </p>
      )}
    </div>
  );
};

export default FaceUpload;
