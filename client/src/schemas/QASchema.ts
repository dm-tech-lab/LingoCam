import * as Yup from "yup";

export const QASchema = Yup.object().shape({
  question: Yup.string()
    .min(10, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  context: Yup.string().required("Required"),
});
