import { createSlice } from "@reduxjs/toolkit";
import { calculatorTotalQuanlity } from "@utils/calculateToTalQuanlity";
import { calculateTotalCost } from "@utils/calculateTotalCost";
const products = [];

const initialState = {
    //doi tuong luu tru trang thai ban dau
    productList: [...products],
    coupon: "",
    totalCost: calculateTotalCost(products, ""),
    totalQuantity: calculatorTotalQuanlity(products),
};

export const productSlice = createSlice({
    //quan lý danh sach san pham trong gio hang
    name: "products", //ten cua slide
    initialState, // trang thai ban dau cua slice
    reducers: {
        initializeProducts: (state, action) => {
            state.productList = action.payload;
        },

        increaseQuantity: (state, action) => {
            const { id } = action.payload;

            const productToUpdate = state.productList.find(
                (product) => product.id === id,
            );

            if (productToUpdate) {
                productToUpdate.count += 1;
            }

            state.totalCost = calculateTotalCost(
                state.productList,
                state.coupon,
            );
            state.totalQuantity = calculatorTotalQuanlity(state.productList);
        },

        decreaseQuantity: (state, action) => {
            const { id } = action.payload;

            const productToUpdate = state.productList.find(
                (product) => product.id === id,
            );

            if (productToUpdate && productToUpdate.count > 1) {
                productToUpdate.count -= 1;
            }

            state.totalCost = calculateTotalCost(
                state.productList,
                state.coupon,
            );
            state.totalQuantity = calculatorTotalQuanlity(state.productList);
        },

        addProductToCart: (state, action) => {
            //them san pham trong gio hang

            console.log(action, state);
            const product = state.productList.find(
                (prod) => prod.id === action.payload.id,
            );

            if (!product) {
                state.productList.push(action.payload);
            } else {
                product.count += 1;
            }

            state.totalCost = calculateTotalCost(
                state.productList,
                state.coupon,
            );

            state.totalQuantity = calculatorTotalQuanlity(state.productList);
        },

        deleteProductFromCart: (state, action) => {
            //xoa san pham khoi gio hang
            const { id } = action.payload;

            const isProduct = state.productList.find(
                (product) => product.id === id,
            );

            if (isProduct) {
                state.productList = state.productList.filter(
                    (product) => product.id !== isProduct.id,
                );
            }

            state.totalCost = calculateTotalCost(
                state.productList,
                state.coupon,
            );
            state.totalQuantity = calculatorTotalQuanlity(state.productList);
        },
        // applyCoupon: (state, action) => {
        //   const { coupon } = action.payload;
        //   state.coupon = coupon;
        //   state.totalCost = calculateTotalCost(state.productList, state.coupon);
        //   state.totalQuantity = calculatorTotalQuanlity(state.productList);
        // },
    },
});

export const {
    productList,
    coupon,
    totalCost,
    totalQuantity,
    increaseQuantity,
    decreaseQuantity,
    addProductToCart,
    deleteProductFromCart,
    applyCoupon,
    totalQuanlity,
} = productSlice.actions;

export default productSlice.reducer;
