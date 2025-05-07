const COUPON = "ABCDE";

export const calculateTotalCost = (productList, coupon) => {
  let totalCost = 0;

  productList.forEach((product) => {
    totalCost += product.count * parseFloat(product.price);
  });

  if (coupon === COUPON) {
    //Giam 20%
    const discount = totalCost * 0.2;

    totalCost -= discount;
  }

  return totalCost.toFixed(2);
};
