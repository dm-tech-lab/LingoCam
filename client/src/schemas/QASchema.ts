import * as Yup from "yup";

export const QASchema = Yup.object().shape({
  question: Yup.string().required("Required"),
});
