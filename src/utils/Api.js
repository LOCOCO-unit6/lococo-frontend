import axios from "axios";

const API_BASE_URL = "http://3.39.0.20:8080";

export const registerGeneral = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/organizer/register`,
      {
        ...formData,
        role: "USER", // 일반 가입이므로 'general'로 고정.
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 이메일 인증 요청 API
export const requestEmailVerification = async (email) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/organizer/send-code?email='${email}`,
      { email }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// 이메일 인증번호 확인 API
export const confirmEmailVerification = async (email, code) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/organizer/verify-code`,
      { email, code }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
