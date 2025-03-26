import httpClient from "../../utils/httpClient";

class AuthService {
  static async verifyUser(userId: string): Promise<any> {
    try {
      const response = await httpClient.get(`http://localhost:3000/user/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error verifying user:", error);
      return null;
    }
  }
}

export default AuthService;
