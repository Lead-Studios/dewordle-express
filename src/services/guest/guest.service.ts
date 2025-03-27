import { v4 as uuidv4 } from "uuid";
import GuestUser from "../../models/guest.model";

const tokenCache = new Map<string, { expiresAt: Date }>();

export default class GuestService {
  static async generateGuestToken(): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    try {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      const guestUser = new GuestUser({
        token,
        expiresAt,
      });

      await guestUser.save();

      return { token, expiresAt };
    } catch (error) {
      console.error("Error generating guest token:", error);
      throw new Error("Failed to generate guest token");
    }
  }

  static async verifyGuestToken(
    token: string
  ): Promise<{ valid: boolean; expiresAt?: Date }> {
    try {
      if (!token) {
        return { valid: false };
      }

      const guestUser = await GuestUser.findOne({ token });

      if (!guestUser) {
        return { valid: false };
      }

      const now = new Date();
      if (now > guestUser.expiresAt) {
        await GuestUser.deleteOne({ token });
        return { valid: false };
      }

      return {
        valid: true,
        expiresAt: guestUser.expiresAt,
      };
    } catch (error) {
      console.error("Error verifying guest token:", error);
      throw new Error("Failed to verify guest token");
    }
  }
  static async getTimeRemaining(token: string): Promise<number> {
    try {
      const guestUser = await GuestUser.findOne({ token });

      if (!guestUser) {
        return 0;
      }

      const now = new Date();
      const expiresAt = guestUser.expiresAt;
      if (now > expiresAt) {
        return 0;
      }
      return Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
    } catch (error) {
      console.error("Error getting time remaining:", error);
      return 0;
    }
  }

  static async invalidateGuestToken(token: string): Promise<void> {
    tokenCache.delete(token);
  }
}
