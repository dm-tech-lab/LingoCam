import { toast } from "react-toastify";

export const showSuccToast = (
  succMessage: string,
  openModalCallback: () => void
) => {
  toast.success(succMessage, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClick: openModalCallback,
  });
};

export const showErrorToast = (
  errorMessage: string,
  openModalCallback: () => void
) => {
  toast.error(errorMessage, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClick: openModalCallback,
  });
};

export const showInfoToast = (
  infoMessage: string,
  openModalCallback: () => void
) => {
  toast.info(infoMessage, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClick: openModalCallback,
  });
};
