import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, 
         newReviewReducer, 
         productDetailsReducer, 
         productsReducer, 
         delProductReducer, 
         delReviewReducer, 
         productReviewsReducer 
        } from "./reducers/productReducer";

import { forgotPasswordReducer, 
         profileReducer, 
         userReducer, 
         allUsersReducer, 
         userDetailsReducer 
       } from "./reducers/userReducer";
       
import { cartReducer } from "./reducers/cartReducer";
import { myOrdersReducer, 
         newOrderReducer, 
         orderDetailsReducer, 
         allOrdersReducer, 
         up_del_OrderReducer 
       } from "./reducers/orderReducer";

// LHS vaale inspect vaale redux states mein dikhenge 
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer, 
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    delProduct: delProductReducer,
    allOrders: allOrdersReducer,
    up_del_Order: up_del_OrderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: delReviewReducer,
});

// let initialState = {}; ab dekho ham initial state ko empty nhi rakhenge, ab agar localstorage mein data hai to vo ya fir state mein jo hoga vo
let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;