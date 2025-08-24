import axios from "axios";

const API_BASE_URL = "http://3.39.0.20:8080/swagger-ui/index.html";

export const registerGeneral = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/organizer/register`,
      {
        ...formData,
        role: "general", // 일반 가입이므로 'general'로 고정.
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
