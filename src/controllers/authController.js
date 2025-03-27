import { passwordResetRequestSchema, passwordResetSchema } from '../validations/authValidations.js';
import TokenService from '../services/tokenService.js';
import EmailService from '../services/emailService.js';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

class AuthController {
  // Request password reset
  async requestPasswordReset(req, res) {
    try {
      const { email } = await passwordResetRequestSchema.validateAsync(req.body);
      
      // Find user by email (without revealing if email exists)
      const user = await UserModel.findByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.status(200).json({
          message: 'If an account exists, a password reset link will be sent'
        });
      }

      // Generate reset token
      const { resetToken, jwtToken } = TokenService.generateResetToken(user.id);
      
      // Hash and store token for verification
      const hashedToken = TokenService.hashResetToken(resetToken);
      await UserModel.storeResetToken(user.id, hashedToken);

      // Construct reset link (frontend will handle token verification)
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${jwtToken}`;

      // Send reset email
      await EmailService.sendPasswordResetEmail(email, resetLink);

      return res.status(200).json({
        message: 'Password reset link sent successfully'
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      return res.status(400).json({ message: 'Password reset request failed' });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = await passwordResetSchema.validateAsync(req.body);
      
      // Verify token
      const decoded = TokenService.verifyResetToken(token);
      
      // Check if token exists and matches for the user
      const hashedToken = TokenService.hashResetToken(decoded.resetToken);
      const user = await UserModel.findByResetToken(hashedToken);

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await UserModel.updatePasswordAndClearToken(user.id, hashedPassword);

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({ message: 'Password reset failed' });
    }
  }
}

export default new AuthController();