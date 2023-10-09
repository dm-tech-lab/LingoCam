import { Link } from "react-router-dom";
import { RegisterSchema } from "../schemas/RegisterSchema";
import { Formik, Field, Form } from "formik";
import { API_URL } from "../constants/urls";
import { useLoading } from "../context/LoadingContext";
import Loader from "../components/shared/Loader";
import { ToastContainer, toast } from "react-toastify";
import { showErrorToast, showSuccToast } from "../utils/Toast";

interface RegisterInitValues {
  email: string;
  username: string;
  password1: string;
  password2: string;
}

const Register = () => {
  const { setLoading } = useLoading();

  const RegisterUser = async (values: RegisterInitValues) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const response = await data.json();
    if (data.ok) showSuccToast(response.detail, () => toast.dismiss());
    else {
      for (const key in response) {
        if (Array.isArray(response[key]) && response[key].length > 0) {
          const errorMessage = response[key][0];
          showErrorToast(errorMessage, () => toast.dismiss());
          break;
        }
      }
    }
    setLoading(false);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        username: "",
        password1: "",
        password2: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={(values: RegisterInitValues) => RegisterUser(values)}
    >
      {({ errors, touched }) => (
        <Form>
          <Loader />
          <ToastContainer />
          <section className="bg-gray-50 dark:bg-gray-900 h-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 ">
              <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                LingoCam
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Create and account
                  </h1>
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="username"
                      required
                    />
                    {errors.username && touched.username && (
                      <div className="text-sm text-red-500">
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                    {errors.email && touched.email && (
                      <div className="text-sm text-red-500">{errors.email}</div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password1"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password1"
                      id="password1"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    {errors.password1 && touched.password1 && (
                      <div className="text-sm text-red-500">
                        {errors.password1}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm password
                    </label>
                    <Field
                      type="password"
                      name="password2"
                      id="password2"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    {errors.password2 && touched.password2 && (
                      <div className="text-sm text-red-500">
                        {errors.password2}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Create an account
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?
                    <Link
                      to="/login"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
