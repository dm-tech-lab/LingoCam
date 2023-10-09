import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  password2: Yup.string()
    .oneOf([Yup.ref("password1")], "Passwords must match")
    .min(8, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password1: Yup.string()
    .min(8, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  username: Yup.string().min(5, "Too Short!").required("Required"),
});
