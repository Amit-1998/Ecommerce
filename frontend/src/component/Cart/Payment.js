import React, { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "../Cart/CheckoutSteps";
import axios from "axios";

import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { clearErrors, createOrder } from "../../actions/orderAction";


const Payment = ({ history }) => {
    
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const payBtn = useRef(null);

    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const paymentData = {
          amount: Math.round(orderInfo.totalPrice * 100), // stripe takes amount in paise
    }

    const order = {
          shippingInfo,
          orderItems: orderInfo.cartItems,
          itemsPrice: orderInfo.subtotal,
          taxPrice: orderInfo.tax,
          shippingPrice: orderInfo.shippingCharges,
          totalPrice: orderInfo.totalPrice,
    }

    const submitHandler = async (e) => {
          e.preventDefault();
          payBtn.current.disabled = true; // payBtn.current kARNE se ham uski html property ko access kar sakte hai
          
          try {
              const config = { headers : {"Content-Type": "application/json",},};
              const { data } = await axios.post("/api/v1/payment/process", paymentData,config);

              const client_secret = data.client_secret;
              if(!stripe || !elements) return; // agar dono mein se ek bhi nhi hai to pehle hi return kardo
                   
              const result = await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                          card: elements.getElement(CardNumberElement),
                          billing_details: {
                                name: user.name,
                                email:user.email,
                                address: {
                                      line1: shippingInfo.address,
                                      city: shippingInfo.city,
                                      state: shippingInfo.state,
                                      postal_code: shippingInfo.pinCode,
                                      country: shippingInfo.country,
                                },
                          }, 
                    },
              });

              if(result.error) {
                    payBtn.current.disabled = false;
                    alert.error(result.error.message);
              }
              else {
                    if(result.paymentIntent.status === "succeeded") {
                          // we will place order at this place--i.e before push "/sucess"
                          order.paymentInfo = {
                              id: result.paymentIntent.id,
                              status: result.paymentIntent.status,
                          };
                          dispatch(createOrder(order));
                          history.push("/success");
                    } else {
                          alert.error("There's some issue while processing payment ");
                    }
              }

          } catch(error) {
               payBtn.current.disabled = false; // agar error aa gya to button ko disable kardo taaki koi click na kar sake
               alert.error(error.response.data.message);
          }
    };

    useEffect(() => {
         if(error) {
               alert.error(error);
               dispatch(clearErrors());
         } 
    }, [dispatch, error, alert]);

    return <Fragment>
             <MetaData title="Payment" />
             <CheckoutSteps activeStep={2}/>

             <div className="paymentContainer">
                   <form className="paymentForm" onSubmit={(e) => submitHandler(e)} >
                          <Typography>Card Info</Typography>
                          <div>
                                <CreditCardIcon />
                                <CardNumberElement className="paymentInput" />
                          </div>

                          <div>
                                <EventIcon />
                                <CardExpiryElement className="paymentInput" />
                          </div>

                          <div>
                                <VpnKeyIcon />
                                <CardCvcElement className="paymentInput" />
                          </div>

                          <input 
                               type="submit"
                               value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                               ref = {payBtn}
                               className="paymentFormBtn"
                          />
                   </form>
             </div>
    </Fragment>;
};

export default Payment;