// Replace with your actual backend API URL
const API_BASE_URL_DEV = import.meta.env.VITE_DEV_API_URL || "http://localhost:8000";
const API_BASE_URL_PROD = import.meta.env.VITE_PROD_API_URL;


// const API_BASE_URL = API_BASE_URL_DEV
const API_BASE_URL = API_BASE_URL_PROD

export const API_ENDPOINTS = {
  SEND_MESSAGE: `${API_BASE_URL}/message`,
  // SEND_MESSAGE: `${API_BASE_URL}/mcp/message`,
  GET_CONVERSATION: `${API_BASE_URL}/message/conversation`,
  EMAIL_CONTACT: `${API_BASE_URL}/email_contact`,
  NOTIFY_TEAMS: `${API_BASE_URL}/notify_teams`,
};
