import { toast } from "react-toastify";

const notify = (message, type, position) => {
  switch (type) {
    case "success":
      toast.success(message, { position });
      break;
    case "error":
      toast.error(message, { position });
      break;
    case "warning":
      toast.warn(message, { position });
      break;
    case "info":
      toast.info(message, { position });
      break;
    default:
      toast(message, { position });
  }
};

export default notify;
