import { authService } from '../services/authService.js';

export const authController = {
  register: async (req, res) => {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json({
        message: 'User registered successfully.',
        user
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return res.status(200).json({
        message: 'Login successful.',
        ...data
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
};
