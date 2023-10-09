import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .min(8, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(8, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  username: Yup.string().min(5, "Too Short!").required("Required"),
});
