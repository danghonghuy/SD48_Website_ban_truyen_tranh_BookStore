import { useCallback } from 'react'; // Thêm useCallback
import useTranslate from '@lang';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd'; // message từ antd không thấy dùng, chỉ có notification
import { toast } from "react-toastify";
import { HTTP_STATUS } from '@configs/app.config';

const {
	BAD_REQUEST,
	UNAUTHORIZED,
	NOT_FOUND,
	METHOD_NOT_ALLOWED,
	TOO_MANY_REQUEST,
	SERVER_ERROR,
} = HTTP_STATUS;

const useHandleError = () => {
	const navigate = useNavigate();
	const t = useTranslate();
    
	const handleError = useCallback((error) => {
		const { response, request } = error;
		let errorDataToReturn = null; // Biến để lưu trữ dữ liệu lỗi trả về

		if (response) {
			const { data, status } = response;
			errorDataToReturn = data; // Gán data từ response để trả về

			// Kiểm tra xem t(data.message) có phải là một hàm không (nếu t trả về hàm)
			// Hoặc đảm bảo data.message là một string key hợp lệ cho t
			const getTranslatedMessage = (key, fallbackKey = 'An error occurred') => {
				const translated = t(key);
				// Giả sử t trả về key nếu không tìm thấy, hoặc bạn có cơ chế fallback
				return translated === key ? t(fallbackKey) : translated;
			};
			
			const messageContent = data?.message ? getTranslatedMessage(data.message) : t('An error occurred');

			switch (status) {
				case BAD_REQUEST:
					// toast.warning(t(data.message).toUpperFirst()); // Giả sử toUpperFirst là extension method
					toast.warning(messageContent.charAt(0).toUpperCase() + messageContent.slice(1));
					break;
				case UNAUTHORIZED:
					notification.info({
						message: (t('login session expired').charAt(0).toUpperCase() + t('login session expired').slice(1)),
						description: (t('please login again').charAt(0).toUpperCase() + t('please login again').slice(1)),
						placement: 'bottomRight'
					});
					navigate('/login');
					break;
				case NOT_FOUND:
					toast.error((t('url not found').charAt(0).toUpperCase() + t('url not found').slice(1)));
					break;
				case METHOD_NOT_ALLOWED:
					toast.error((t('method not allowed').charAt(0).toUpperCase() + t('method not allowed').slice(1)));
					break;
				case TOO_MANY_REQUEST:
					toast.error((t('too many request').charAt(0).toUpperCase() + t('too many request').slice(1)));
					break;
				case SERVER_ERROR:
					// toast.error({ // toast.error không nhận object như notification
					// 	message: (t('server error').charAt(0).toUpperCase() + t('server error').slice(1)),
					// 	description: data?.message || t('An internal server error occurred'), // Sử dụng data.message nếu có
					// 	placement: 'bottomRight' // toast không có placement
					// });
					toast.error(`${t('server error').charAt(0).toUpperCase() + t('server error').slice(1)}${data?.message ? `: ${data.message}` : ''}`);
					break;
				default:
					toast.error(`${t('error').charAt(0).toUpperCase() + t('error').slice(1)}: ${status}`);
					break;
			}
		} else if (request) {
			// const { _hasError, _sent } = request; // Các thuộc tính này có thể không chuẩn hoặc không tồn tại trên mọi error object
			console.log("Request Error (no response):", request);
			// Phân biệt lỗi mạng và lỗi server không phản hồi có thể khó khăn chỉ với error.request
			// Thường thì error.message sẽ cho biết thêm (ví dụ: "Network Error")
			if (error.message && error.message.toLowerCase().includes('network error')) {
				toast.error(t('network error').charAt(0).toUpperCase() + t('network error').slice(1));
			} else {
				toast.error(t('server not respond').charAt(0).toUpperCase() + t('server not respond').slice(1));
			}
			errorDataToReturn = { message: t('server not respond') }; // Cung cấp một object lỗi cơ bản
		} else {
			// Lỗi không xác định (ví dụ: lỗi trong quá trình thiết lập request)
			console.error("Unknown Error:", error);
			toast.error(t('an unknown error occurred').charAt(0).toUpperCase() + t('an unknown error occurred').slice(1));
			errorDataToReturn = { message: t('an unknown error occurred') }; // Cung cấp một object lỗi cơ bản
		}
		// Đảm bảo luôn trả về một object có cấu trúc nhất quán, ví dụ: { message: "...", originalError: error, ... }
		// Hoặc chỉ trả về data từ response nếu có, còn không thì là một object lỗi tự tạo.
		return errorDataToReturn || { message: t('an error occurred while processing the request') };

	}, [navigate, t]); // Dependencies là navigate và t

	return handleError;
};

export default useHandleError;