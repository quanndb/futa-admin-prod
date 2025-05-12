import { toast } from "react-toastify";

export const showError = (error: any) => {
  // Xử lý lỗi từ API
  let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";

  if (error.response) {
    // Lỗi từ server với response
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    } else if (error.response.statusText) {
      errorMessage = `Lỗi: ${error.response.status} - ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Lỗi không nhận được response
    errorMessage =
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  } else if (error.message) {
    // Lỗi khác
    errorMessage = error.message;
  }
  toast.error(errorMessage);
};

export const showSuccess = (message: string) => {
  toast.success(message);
};
