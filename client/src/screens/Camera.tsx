import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import { useProtectedRoute } from "../utils/ProtectedRoutes";
import { API_URL } from "../constants/urls";
import { useLoading } from "../context/LoadingContext";
import Modal from "react-modal";
import { Field, Form, Formik } from "formik";
import { QASchema } from "../schemas/QASchema";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const Camera = () => {
  useProtectedRoute();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const webcamRef = useRef<any>(null);
  const [facingMode] = useState(FACING_MODE_ENVIRONMENT);

  const { setLoading } = useLoading();

  // const handleSwitchCamera = useCallback(() => {
  //   setFacingMode((prevState) =>
  //     prevState === FACING_MODE_USER
  //       ? FACING_MODE_ENVIRONMENT
  //       : FACING_MODE_USER
  //   );
  // }, []);

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
    console.log(response);
    setLoading(false);
  }, [webcamRef]);

  const askGPT = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("question", "Обобщи");
    formData.append("context", "Втората световна война");

    const data = await fetch(`${API_URL}/qa/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    });
    const response = await data.json();
    console.log(response);
    setLoading(false);
  };

  return (
    <div className="flex">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
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
        onClick={() => setIsModalOpen(true)}
        className="z-50 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        Show translated Text
      </button>
      <Modal
        isOpen={isModalOpen}
        contentLabel="Login Modal Modal"
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
            minWidth: "90%",
            padding: "60px 50px",
            fontSize: "2rem",
            borderRadius: "20px",
          },
        }}
        onRequestClose={() => setIsModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <Formik
          initialValues={{
            context: "",
            question: "",
          }}
          validationSchema={QASchema}
          onSubmit={(values) => console.log(values)}
        >
          {({ errors, touched }) => (
            <Form className="flex justify-center items-center flex-col">
              <div>
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
                  placeholder="Question about the translated text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  autoComplete="true"
                />
                {errors.question && touched.question && (
                  <div className="text-sm text-red-500">{errors.question}</div>
                )}
              </div>
              <div>
                <label
                  htmlFor="context"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Context
                </label>
                <Field
                  type="text"
                  name="context"
                  id="context"
                  placeholder="Context of the question"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  autoComplete="true"
                />
                {errors.context && touched.context && (
                  <div className="text-sm text-red-500">{errors.context}</div>
                )}
              </div>
              <button
                onClick={askGPT}
                type="submit"
                className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Ask GPT
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Camera;
