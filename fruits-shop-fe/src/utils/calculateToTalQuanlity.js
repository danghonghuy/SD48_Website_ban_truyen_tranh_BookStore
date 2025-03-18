export const calculatorTotalQuanlity = (products) => {
  const total = products.reduce((total, product) => total + product.count, 0);

  return total;
};
