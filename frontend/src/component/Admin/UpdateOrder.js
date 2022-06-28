import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
// import CheckoutSteps from "./CheckoutSteps.js";
import { Typography } from "@material-ui/core";
// import "./ConfirmOrder.css";
import Sidebar from "./Sidebar.js";
import { getOrderDetails, updateOrder, clearErrors } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader.js";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./UpdateOrder.css";

const UpdateOrder = ({ history, match }) => {
    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated } = useSelector((state) => state.up_del_Order);
    const [status, setStatus] = useState("");
    const dispatch = useDispatch();
    const alert = useAlert();

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("status", status);
        dispatch(updateOrder(match.params.id, myForm));
    }

    useEffect(() => {
        if(error) {
            alert.error(error)
            dispatch(clearErrors());
        }
        if(updateError) {
            alert.error(updateError)
            dispatch(clearErrors());
        }
        if(isUpdated) {
            alert.success("Order Updated Successfully");
            dispatch({ type: UPDATE_ORDER_RESET });
        }
        dispatch(getOrderDetails(match.params.id));
    }, [dispatch, alert, error, updateError, match.params.id, isUpdated]);

    return (
        <Fragment>
                <MetaData title="Update Order" />
                <div className="dashboard">
                    <Sidebar />
                    <div className="newProductContainer">
                         { loading ? <Loader /> : 
                                            <div className="confirmOrderPage" style={{display: order.orderStatus === "Delivered" ? "block" : "grid",}}>
                                            <div>
                                                <div className="confirmshippingArea">
                                                        <Typography>Shipping Info</Typography>
                                                        <div className="orderDetailsContainerBox">
                                                            <div>
                                                                <p>Name:</p>
                                                                <span>{order.user && order.user.name}</span>
                                                            </div>   
                                            
                                                            <div>
                                                                <p>Phone:</p>
                                                                <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                                                            </div>

                                                            <div>
                                                                <p>Address:</p>
                                                                <span>
                                                                    { order && order.shippingInfo && 
                                                                                `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Typography>Payment</Typography>
                                                        <div className="orderDetailsContainerBox">
                                                            <div>
                                                                <p className={
                                                                    order.paymentInfo && 
                                                                    order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor"
                                                                }>
                                                                    { order.paymentInfo && 
                                                                    order.paymentInfo.status === "succeeded" ? "PAID" : "NOT PAID"
                                                                    }
                                                                </p>
                                                            </div>
                                
                                                            <div>
                                                                    <p>Amount:</p>
                                                                    <span>{order.totalPrice && order.totalPrice}</span>
                                                            </div>
                                                        </div>
                                
                                                        <Typography>Order Status</Typography>
                                                        <div className="orderDetailsContainerBox">
                                                            <div>
                                                                <p className={
                                                                    order.orderStatus && order.orderStatus === "Delivered" ? "greenColor" : "redColor"
                                                                }>
                                                                    { order.orderStatus && order.orderStatus }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                            
                                                    <div className="confirmCartItems">
                                                        <Typography>Your Cart Items:</Typography>
                                                        <div className="confirmCartItemsContainer">
                                                                {order && order.orderItems && 
                                                                    order.orderItems.map((item) => (
                                                                                <div key={item.product} >
                                                                                    <img src={item.image} alt="Product" />
                                                                                    <Link to={`/product/${item.product}`}>
                                                                                        {item.name}
                                                                                    </Link>
                                                                                    <span>
                                                                                            {item.quantity} x ₹{item.price} = {" "}
                                                                                            <b>₹{item.price * item.quantity}</b>
                                                                                    </span>
                                                                                </div>
                                                                    ))
                                                                }
                                                        </div>
                                                    </div>
                                            </div>
                                            {/* niche vaala section ke liye*/ }
                                            <div style={{ display: order.orderStatus === "Delivered" ? "none": "block",}}>
                                                            <form className='updateOrderForm' onSubmit={updateOrderSubmitHandler} >
                                                            <h1>Update Order</h1>
                        
                                                            <div>
                                                                <AccountTreeIcon />
                                                                <select onChange={(e) => setStatus(e.target.value)}>
                                                                    <option value="">Choose Category</option>
                                                                    {order.orderStatus === "Processing" && (
                                                                        <option value="Shipped">Shipped</option>
                                                                    )}
                                                                    {order.orderStatus === "Shipped" && (
                                                                        <option value="Delivered">Delivered</option>
                                                                    )}
                                                                </select>
                                                            </div>
                        
                                                            <Button id="createProductBtn" type="submit" disabled={loading ? true : false || status === "" ? true : false} >
                                                                UPDATE
                                                            </Button>
                                                    </form>
                                            </div>
                                </div>
                         }
                    </div>
                </div>
        </Fragment>
       
    );
};

export default UpdateOrder;