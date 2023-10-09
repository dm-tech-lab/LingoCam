import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import { useProtectedRoute } from "../utils/ProtectedRoutes";

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

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
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
