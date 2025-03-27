import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class TokenService {
  // Generate a cryptographically secure reset token
  generateResetToken(userId) {
    // Create a random token with high entropy
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Create a JWT with additional security
    const jwtToken = jwt.sign(
      { 
        userId, 
        resetToken,
        type: 'password_reset' 
      }, 
      process.env.JWT_SECRET,
      { 
        expiresIn: '15m' // Token expires in 15 minutes
      }
    );

    return {
      resetToken,
      jwtToken
    };
  }

  // Verify the reset token
  verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Additional checks for token type and validity
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Reset token has expired');
      }
      throw new Error('Invalid reset token');
    }
  }

  // Hash the reset token for secure storage
  hashResetToken(token) {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }
}

export default new TokenService();