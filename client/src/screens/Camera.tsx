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
  const [facingMode, ] = useState(FACING_MODE_ENVIRONMENT);

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
    <div className="flex flex-col h-screen">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
        className="flex-1"
      />
      <div className="flex justify-center items-center">
        <button
          onClick={capturePhoto}
          className="w-40 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Capture photo
        </button>
      </div>
    </div>
  );
};

export default Camera;
