import { checkoutService } from '../services/checkoutService.js';

export const checkoutController = {
  checkout: async (req, res) => {
    try {
      const result = await checkoutService.processCheckout(req.user, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};
