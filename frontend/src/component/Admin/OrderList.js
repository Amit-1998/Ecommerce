import React, { Fragment, useEffect } from 'react';
import "./ProductList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
// import { clearErrors, getAdminProduct, deleteProduct } from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar.js";
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction';


const OrderList = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, orders } = useSelector((state) => state.allOrders);
  const { error:deleteError, isDeleted } = useSelector((state) => state.up_del_Order);

  const deleteOrderHandler = (id) => {
       dispatch(deleteOrder(id));
  }

  useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if(isDeleted) {
            alert.success("Order Deleted Successfully");
            history.push("/admin/orders");
            dispatch({ type: DELETE_ORDER_RESET }); // isdeleted ko false karne ke liye varna baar baar call hota rahega
        }
        dispatch(getAllOrders());
  }, [dispatch, error, alert, deleteError, history, isDeleted ]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 0.63 },
    { field: "status", headerName: "Status", minWidth: 150, flex: 0.5, 
      cellClassName: (params) => {
          return params.getValue(params.id, "status") === "Delivered"
             ? "greenColor"
             : "redColor";
      },
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.3 },
    { field: "amount", headerName: "Amount", type: "number", minWidth: 270, flex: 0.5 },
       { field: "actions", headerName: "Actions", type: "number", minWidth: 150, flex: 0.3, sortable: false,
          renderCell: (params) => {
              return (
                  <Fragment>
                          <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                                <EditIcon />
                          </Link>
                           
                          <Button onClick = {() => deleteOrderHandler(params.getValue(params.id, "id"))} >
                                 <DeleteIcon />
                          </Button>
                  </Fragment>
              );     
          },
       },

  ];

  const rows = [];
   
  orders && 
      orders.forEach((item) => {
          rows.push({
             id: item._id,
             itemsQty: item.orderItems.length,
             amount: item.totalPrice,
             status: item.orderStatus,
          });
      });
  
  return (
      <Fragment>
             <MetaData title={`ALL ORDERS - Admin`} />

             <div className="dashboard">
                   <Sidebar />
                   <div className="productListContainer">
                       <h1 id="productListHeading">All ORDERS</h1>
                       <DataGrid rows={rows} 
                                 columns={columns} 
                                 pageSize={10} 
                                 disableSelectionOnClick 
                                 className="productListTable" 
                                 autoHeight
                        />
                   </div>
             </div>
      </Fragment>
  );
};

export default OrderList;