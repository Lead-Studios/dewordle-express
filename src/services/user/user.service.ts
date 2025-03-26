import httpClient from "../../utils/httpClient";

class UserService {
  static async authenticateUser(token: string): Promise<any> {
    try {
        const response = await httpClient.post("http://localhost:3000/auth/validate-token", { token });
      return response.data;
    } catch (error) {
      console.error("Error authenticating user:", error);
      return null;
    }
  }
}

export default UserService;
