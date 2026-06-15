import { ProductModel } from '../models/productModel.js';

export const checkoutService = {
  processCheckout: async (user, checkoutData) => {
    const { items, paymentMethod } = checkoutData;

    // Validate payment method
    if (!paymentMethod) {
      throw new Error('Payment method is required.');
    }

    const allowedMethods = ['cash', 'credit card'];
    if (!allowedMethods.includes(paymentMethod.toLowerCase())) {
      throw new Error('Invalid payment method. Only "cash" or "credit card" are accepted.');
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Checkout items must be a non-empty array.');
    }

    let originalTotal = 0;
    const checkoutItems = [];

    for (const item of items) {
      const { productId, quantity } = item;
      
      if (!productId || !quantity || quantity <= 0) {
        throw new Error('Each item must have a valid productId and a positive quantity.');
      }

      const product = ProductModel.findById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const itemTotal = product.price * quantity;
      originalTotal += itemTotal;

      checkoutItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        total: itemTotal
      });
    }

    // Apply calculations
    let discount = 0;
    const isCash = paymentMethod.toLowerCase() === 'cash';
    
    if (isCash) {
      discount = originalTotal * 0.10; // 10% discount
    }

    const finalTotal = originalTotal - discount;

    return {
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      paymentMethod: paymentMethod.toLowerCase(),
      items: checkoutItems,
      originalTotal: Number(originalTotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      message: isCash 
        ? 'Checkout successful with a 10% cash discount applied!' 
        : 'Checkout successful with credit card. No discount applied.',
      timestamp: new Date().toISOString()
    };
  }
};
