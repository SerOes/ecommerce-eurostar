const products = [
  { id: "prod-1", name: "Laptop", price: 1000.00 },
  { id: "prod-2", name: "Smartphone", price: 500.00 },
  { id: "prod-3", name: "Headphones", price: 100.00 }
];

export const ProductModel = {
  findAll: () => {
    return [...products];
  },

  findById: (id) => {
    return products.find(p => p.id === id) || null;
  }
};
