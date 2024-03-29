import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Switch } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import { useSelector, useDispatch } from "react-redux";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import LoginSignUp from "./component/User/LoginSignUp";
import UpdateProfile from "./component/User/UpdateProfile.js";

import store from "./store";
import { loadUser } from "./actions/userAction";

import UserOptions from "./component/layout/Header/UserOptions.js";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js"; 
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import OrderDetails from "./component/Order/OrderDetails.js";
// for using <CardNumberElement /> we have to import 
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import UpdateOrder from "./component/Admin/UpdateOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import NotFound from "./component/layout/Not Found/NotFound.js";

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  
  const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );
    
  async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
      // The Web Font Loader is able to load fonts from Google Fonts, Typekit, Fonts.com, and Fontdeck, as well as self-hosted web fonts.
      WebFont.load({
          google: {
             families: ["Roboto", "Droid Sans", "Chilanka"],
          },
      });
     
     store.dispatch(loadUser()); // dispatch ko use karne ka ek nya tarika
     getStripeApiKey();
  },[]);

//   website par right click se inspect nhi kar payenge
//   window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
      <Router>
          <Header />
               
                        { isAuthenticated && <UserOptions user={user} /> }

                        { stripeApiKey && (
                            <Elements stripe={loadStripe(stripeApiKey)}>
                                <ProtectedRoute exact path="/process/payment" component={ Payment } />
                            </Elements>
                        )}
                        
                        {/* Switch mein koi ek hi route render hota hai */}
                        <Switch>
                            <Route exact path="/" component={Home} /> 
                            <Route exact path="/product/:id" component={ ProductDetails } />
                            <Route exact path="/products" component={ Products } />
                            <Route path="/products/:keyword" component={ Products } />
                            <Route exact path="/search" component={ Search } />
                            <Route exact path="/contact" component={ Contact } />
                            <Route exact path="/about" component={ About } />
                            {/* The home and about routes are public meaning anyone can access them, but the profile route requires users to be authenticated first. Therefore, you need to create a way to log in users.*/}
                            <ProtectedRoute exact path="/account" component={ Profile } />
                            <ProtectedRoute exact path="/me/update" component={ UpdateProfile } />
                            <ProtectedRoute exact path="/password/update" component={ UpdatePassword }/>
                            <Route exact path="/password/forgot" component={ ForgotPassword }/>
                            <Route exact path="/password/reset/:token" component={ ResetPassword }/>
                            <Route exact path="/login" component={ LoginSignUp } />
                            <Route exact path="/cart" component={ Cart } />
                            
                            <ProtectedRoute exact path="/shipping" component={ Shipping } />
                            <ProtectedRoute exact path="/success" component={OrderSuccess} />
                            <ProtectedRoute exact path="/orders" component={MyOrders} />

                            <ProtectedRoute exact path="/order/confirm" component={ ConfirmOrder } />
                            <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
                                
                            {/* Role based access-control => protected routes*/}
                            <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={Dashboard} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/products" component={ProductList} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/product/new" component={NewProduct} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/orders" component={OrderList} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/order/:id" component={UpdateOrder} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/users" component={UsersList} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/user/:id" component={UpdateUser} />
                            <ProtectedRoute isAdmin={true} exact path="/admin/reviews" component={ProductReviews} />
                            
                            {/* koi sa route nhi mila to Notfound vaala chalega*/ }
                            <Route component={window.location.pathname === "/process/payment" ? null : NotFound } /> 
                      </Switch>
          <Footer />
      </Router>      
  );
}

export default App;
