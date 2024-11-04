import { toast, Bounce, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to trigger toast notifications
const ShowToast = (type: TypeOptions, message: string) => {
  const customStyle = type === "success" ? { backgroundColor: "#4BB543" } : {};
  toast(message, {
    type,
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
    transition: Bounce,
    style: customStyle,
  });
};

export default ShowToast;
