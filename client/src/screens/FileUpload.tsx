import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { API_URL } from "../constants/urls";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../utils/Toast";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/shared/Loader";
import { useLoading } from "../context/LoadingContext";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [base64String, setBase64String] = useState("");
  const [textResult, setTextResult] = useState("");
  const [textENGResult, setTextENGResult] = useState("")

  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const fileValidationSchema = Yup.object().shape({
    file: Yup.mixed().required("A file is required"),
  });

  const submitFile = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", base64String);

    const data = await fetch(`${API_URL}/ocr/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")!}`,
      },
      body: formData,
    });
    const response = await data.json();
    setTextResult(response.text);
    setTextENGResult(response.result)

    setLoading(false);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = arrayBufferToBase64(e.target!.result);
        setBase64String(base64);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  };

  const translateToEnglishText = () => setTextResult(textENGResult)

  return (
    <div className="flex items-center justify-center">
      <Loader />
      <ToastContainer />
      <button
        type="button"
        onClick={() => navigate("/camera")}
        className="fixed right-2 top-2 font-medium underline z-50"
      >
        Camera
      </button>
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <Formik
          initialValues={{
            file: null,
          }}
          validationSchema={fileValidationSchema}
          onSubmit={submitFile}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="py-6 px-9">
              <div className="mb-6 pt-4">
                <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                  Upload File
                </label>

                <div className="mb-8">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    className="sr-only"
                    onChange={(event) => {
                      const selectedFile = event.currentTarget.files![0];
                      handleFileInputChange(event);
                      if (selectedFile) {
                        const fileType = selectedFile.type;
                        const allowedFileTypes = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "application/pdf",
                        ];

                        if (allowedFileTypes.includes(fileType)) {
                          setFieldValue("file", selectedFile);
                          setSelectedFile(selectedFile.name);
                        } else {
                          showErrorToast(
                            "Invalid file type. Please select a valid file.",
                            () => toast.dismiss()
                          );
                        }
                      }
                    }}
                  />
                  {errors.file && touched.file && (
                    <div className="text-sm text-red-500">{errors.file}</div>
                  )}
                  <label
                    htmlFor="file"
                    className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                  >
                    <div>
                      <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                        Drop file here
                      </span>
                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                        Or
                      </span>
                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                        Browse
                      </span>
                    </div>
                  </label>
                </div>

                {selectedFile !== "" && (
                  <div className="mb-5 rounded-md bg-[#F5F7FB] py-4 px-8">
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-3 text-base font-medium text-[#07074D]">
                        {selectedFile}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Send File
                </button>
                <button
                onClick={translateToEnglishText}
                  type="button"
                  className="mt-4 hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Translate
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {textResult !== "" && (
          <div className="flex justify-center items-center h-full text-base">
            {textResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
