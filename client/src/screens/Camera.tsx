import Webcam from "react-webcam";
import { useCallback, useState } from "react";
import { useProtectedRoute } from "../utils/ProtectedRoutes";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const Camera = () => {
  useProtectedRoute();

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
        className="flex-1"
      />
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white py-2 px-4 absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
      >
        Switch camera
      </button>
    </div>
  );
};

export default Camera;
