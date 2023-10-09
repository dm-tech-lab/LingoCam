import Webcam from "react-webcam";
import { useWindowSize } from "../context/WindowSize";
import { useEffect, useState } from "react";
import { useProtectedRoute } from "../utils/ProtectedRoutes";

const Camera = () => {
  useProtectedRoute();

  const { width, height } = useWindowSize();
  const isLandscape = width <= height;
  const [facingMode, setFacingMode] = useState("user");

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      setFacingMode("environment"); // Use rear camera on mobile
    } else {
      setFacingMode("user"); // Use front camera on desktop
    }
  }, [width, height]);

  const videoConstraints = {
    width: isLandscape ? width : height,
    height: isLandscape ? height : width,
    facingMode: facingMode,
  };

  return (
    <div className="flex flex-col h-screen">
      <Webcam
        audio={false}
        height={isLandscape ? height : width}
        screenshotFormat="image/jpeg"
        width={isLandscape ? width : height}
        videoConstraints={videoConstraints}
        className="flex-1"
      />
      <button className="bg-blue-500 text-white py-2 px-4 absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        Your Button
      </button>
    </div>
  );
};

export default Camera;
