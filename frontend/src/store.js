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
// JSON. parse() function is used to convert a string into a JavaScript object 
// while JSON. stringify() function is used to convert a JavaScript object into a string.
let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
        shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
    },
};

//  most common use case for middleware is to support asynchronous actions without much boilerplate code 
//  It does so by letting you dispatch async actions in addition to normal actions.

// Once Redux Thunk has been installed and included in your project with applyMiddleware(thunk), you can start dispatching actions asynchronously.
const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;