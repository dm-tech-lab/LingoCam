import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import { useProtectedRoute } from "../utils/ProtectedRoutes";
import { API_URL } from "../constants/urls";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const Camera = () => {
  useProtectedRoute();

  const webcamRef = useRef<any>(null);
  const [, setImgSrc] = useState(null);
  const [facingMode] = useState(FACING_MODE_ENVIRONMENT);

  // const handleSwitchCamera = useCallback(() => {
  //   setFacingMode((prevState) =>
  //     prevState === FACING_MODE_USER
  //       ? FACING_MODE_ENVIRONMENT
  //       : FACING_MODE_USER
  //   );
  // }, []);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // Extract the base64 data from the imageSrc
    const base64Data = imageSrc.split(",")[1];

    // Decode base64 to binary
    const binaryData = atob(base64Data);

    // Create an array to hold the binary data
    const dataArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      dataArray[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob object from the binary data
    const blob = new Blob([dataArray], { type: "image/jpeg" }); // Adjust the type as needed

    // Create a FormData object to send the file as part of the request body
    const formData = new FormData();
    formData.append("image", blob, "photo.jpeg");

    const data = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Context-Type": "image/jpeg",
      },
      body: formData,
    });

    const response = await data.json();
    console.log(response);
  }, [webcamRef]);

  return (
    <div className="flex">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
        style={{
          position: "absolute",
          textAlign: "center",
          zIndex: 8,
          right: 0,
          height: "100vh",
          width: "100%",
          objectFit: "fill",
        }}
        className="flex-1"
      />
      <button
        onClick={capturePhoto}
        className="z-50 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        Capture photo
      </button>
    </div>
  );
};

export default Camera;
