import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { LoginSchema } from "../schemas/LoginSchema";
import { showErrorToast, showSuccToast } from "../utils/Toast";
import { useLoading } from "../context/LoadingContext";
import { API_URL } from "../constants/urls";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/shared/Loader";

interface LoginInitValues {
  email: string;
  password: string;
}

const Login = () => {
  const { setLoading } = useLoading();

  const LoginUser = async (values: LoginInitValues) => {
    setLoading(true);

    const data = await fetch(`${API_URL}/auth/login/`, {
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
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={(values: LoginInitValues) => LoginUser(values)}
    >
      {({ errors, touched }) => (
        <Form>
          <Loader />
          <ToastContainer />
          <section className="bg-gray-50 dark:bg-gray-900 h-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
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
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    {errors.password && touched.password && (
                      <div className="text-sm text-red-500">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Login
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don't have an account?
                    <Link
                      to="/"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Register here
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

export default Login;
