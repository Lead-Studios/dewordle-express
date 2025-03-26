import axios from "axios";

const httpClient = axios.create({
  timeout: 5000, // 5 seconds timeout
});

export default httpClient;
