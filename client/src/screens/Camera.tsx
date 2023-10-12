import { useCallback, useEffect, useRef, useState } from "react";
import { useProtectedRoute } from "../utils/ProtectedRoutes";
import { API_URL } from "../constants/urls";
import { useLoading } from "../context/LoadingContext";
import { Field, Form, Formik } from "formik";
import { QASchema } from "../schemas/QASchema";
import { showErrorToast, showInfoToast } from "../utils/Toast";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Modal from "react-modal";
import Loader from "../components/shared/Loader";
import "../style/style.css";

interface IGPTValuesForm {
  question: string;
}

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const Camera = () => {
  useProtectedRoute();

  const [isGPTModalOpen, setIsGPTModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isGPTAnswerModalOpen, setIsGPTAnswerModalOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [facingMode] = useState(FACING_MODE_ENVIRONMENT);

  const [translatedText, setTransatedText] = useState("");
  const [gptAnswer, setGPTAnswer] = useState("");

  const webcamRef = useRef<any>(null);

  const { setLoading } = useLoading();
  const navigate = useNavigate();

  // const handleSwitchCamera = useCallback(() => {
  //   setFacingMode((prevState) =>
  //     prevState === FACING_MODE_USER
  //       ? FACING_MODE_ENVIRONMENT
  //       : FACING_MODE_USER
  //   );
  // }, []);

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    )
      setIsMobile(true);
    else setIsMobile(false);
  }, []);

  const handleCameraError = (err) => {
    if (err.name === "NotAllowedError") navigate("/file-upload");
  };

  const capturePhoto = useCallback(async () => {
    setLoading(true);
    const imageSrc = webcamRef.current.getScreenshot();
    const formData = new FormData();
    formData.append("image", imageSrc);

    const data = await fetch(`${API_URL}/ocr/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")!}`,
      },
      body: formData,
    });

    const response = await data.json();
    if (response.text === "")
      showErrorToast("Cannot translate the current image!", () =>
        toast.dismiss()
      );

    setTransatedText(response.text);

    setLoading(false);

    if (response.text !== "") setIsTranslateModalOpen(true);
  }, [webcamRef]);

  const askGPT = async (values: IGPTValuesForm) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("question", values.question);
    formData.append("context", translatedText);

    const data = await fetch(`${API_URL}/qa/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    });
    const response = await data.json();
    setGPTAnswer(response.answer);
    console.log(response.answer);

    setIsGPTModalOpen(false);
    setIsGPTAnswerModalOpen(true);
    setLoading(false);
  };

  const openGPTModal = () => {
    setIsTranslateModalOpen(false);
    setIsGPTModalOpen(true);
  };

  const showTranslatedTextModal = () => {
    if (translatedText !== "") setIsTranslateModalOpen(true);
    else showInfoToast("Please capture photo", () => toast.dismiss());
  };

  return (
    <div className="flex">
      <Loader />
      <ToastContainer style={{ zIndex: "99999" }} />
      <button
        type="button"
        onClick={() => navigate("/file-upload")}
        className="fixed right-2 top-2 font-medium underline z-50"
      >
        Upload
      </button>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
        onUserMediaError={handleCameraError}
        style={{
          position: "absolute",
          textAlign: "center",
          right: 0,
          height: "100vh",
          width: "100%",
          objectFit: "fill",
        }}
        className="flex-1"
      />
      <button
        onClick={capturePhoto}
        className="z-50 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute bottom-20 left-1/2 transform -translate-x-1/2"
      >
        Capture photo
      </button>
      <button
        onClick={showTranslatedTextModal}
        className="z-50 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        Show translated Text
      </button>
      <Modal
        isOpen={isGPTModalOpen}
        contentLabel="GPT Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            maxWidth: "1000px",
            minWidth: isMobile ? "90%" : "50%",
            padding: "60px 50px",
            fontSize: "2rem",
            borderRadius: "20px",
          },
        }}
        onRequestClose={() => setIsGPTModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <Formik
          initialValues={{
            question: "",
          }}
          validationSchema={QASchema}
          onSubmit={(values: IGPTValuesForm) => askGPT(values)}
        >
          {({ errors, touched }) => (
            <Form className="flex justify-center items-center flex-col">
              <label
                htmlFor="question"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Question
              </label>
              <Field
                type="text"
                name="question"
                id="question"
                placeholder="About the translated text"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                autoComplete="true"
              />
              {errors.question && touched.question && (
                <div className="text-sm text-red-500">{errors.question}</div>
              )}

              <div className="flex justify-center items-center w-full">
                <button
                  type="submit"
                  className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  SUBMIT
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal
        isOpen={isTranslateModalOpen}
        contentLabel="Translate Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            maxWidth: "1000px",
            minWidth: isMobile ? "90%" : "50%",
            padding: "60px 50px",
            fontSize: "2rem",
            borderRadius: "20px",
          },
        }}
        onRequestClose={() => setIsTranslateModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <div className="text-base	font-normal">{translatedText}</div>
        <div className="flex justify-center items-center w-full">
          <button
            onClick={openGPTModal}
            type="submit"
            className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            ASK
          </button>
        </div>
      </Modal>
      <Modal
        className="gpt-modal"
        isOpen={isGPTAnswerModalOpen}
        contentLabel="GPT Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            maxWidth: "1000px",
            minWidth: isMobile ? "90%" : "50%",
            padding: "60px 50px",
            fontSize: "2rem",
            borderRadius: "20px",
          },
          zIndex: "99999999",
        }}
        onRequestClose={() => setIsGPTAnswerModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <div className="text-base">{gptAnswer}</div>
      </Modal>
    </div>
  );
};

export default Camera;
