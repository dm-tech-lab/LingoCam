import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { API_URL } from "../constants/urls";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState("");

  const fileValidationSchema = Yup.object().shape({
    file: Yup.mixed().required("A file is required"),
  });

  const submitFile = async () => {
    const data = await fetch(`${API_URL}`);
    const response = await data.json();
    console.log(response);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <Formik
          initialValues={{
            file: null,
          }}
          validationSchema={fileValidationSchema}
          onSubmit={(values) => console.log(values)}
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
                    className="sr-only"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files![0]);
                      setSelectedFile(event.currentTarget.files![0].name);
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FileUpload;
