import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid"; // ye khud table bna deta hai hame bas row & col dene hote hai
import "./MyOrders.css";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, myOrders } from "../../actions/orderAction";
import LaunchIcon from "@material-ui/icons/Launch";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";

const MyOrders = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);

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
        { field: "actions", flex: 0.3, headerName: "Actions", minWidth: 150, type: "number", sortable: false,
          renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id, "id")}`}>
                        <LaunchIcon />
                    </Link>
                );
          },
        },
    ];
    const rows = [];

    orders && orders.forEach((item, index) => {
        // console.log(item);
        rows.push({
            itemsQty: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice,
        });
    });
    // agar error hoga to uske liye bhi useEffect lga leta hu
    useEffect(() => {
         if(error) {
             alert.error(error);
             dispatch(clearErrors());
         }
         dispatch(myOrders());
    }, [dispatch, alert, error]);

    return <Fragment>
          <MetaData title={`${user.name} - Orders`} />
          {loading ? (<Loader />) : (
              <div className="myOrdersPage">
                  <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10} // ek page mein 10 items dikhe
                      disableSelectionOnClick
                      className="myOrdersTable"
                      autoHeight // table khud hi height set karle 10 rows ke baad
                  />

                  <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
              </div>                         
          )}  
    </Fragment>;  
    
};

export default MyOrders;