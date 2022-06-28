import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO  } from "../constants/cartConstants";
import axios from "axios";

// getState is used to access the state
// Add to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    // here no need of try n catch block
       const { data } = await axios.get(`/api/v1/product/${id}`);
       dispatch({
            type: ADD_TO_CART, 
            payload: {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images[0].url,
                stock: data.product.stock,
                quantity,
            }, 
        });
      
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
     dispatch({
         type: REMOVE_CART_ITEM,
         payload: id,
     });
     localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
}

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async(dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
}