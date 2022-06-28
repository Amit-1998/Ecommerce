import React, { Fragment, useEffect } from 'react';
import "./ProductList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, deleteUser, getAllUsers } from "../../actions/userAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar.js";
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UsersList = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, users} = useSelector((state) => state.allUsers);
  const { error:deleteError, isDeleted, message } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
      dispatch(deleteUser(id));
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
            alert.success(message);
            history.push("/admin/users");
            dispatch({ type: DELETE_USER_RESET }); // isdeleted ko false karne ke liye varna baar baar call hota rahega
        }
        dispatch(getAllUsers());
  }, [dispatch, error, alert, deleteError, history, isDeleted, message ]);

  // type: Number hatane se vo left mein shift ho jata hai
  const columns = [
       { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },
       { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
       { field: "name", headerName: "Name", minWidth: 150, flex: 0.5 },
       { field: "role", headerName: "Role", minWidth: 150, flex: 0.3,
         cellClassName: (params) => {
            return params.getValue(params.id, "role") === "admin" ? "greenColor" : "redColor";
         },
       },
       { field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, sortable: false,
          renderCell: (params) => {
              return (
                  <Fragment>
                          <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                                <EditIcon />
                          </Link>
                           
                          <Button onClick = {() => deleteUserHandler(params.getValue(params.id, "id"))} >
                                 <DeleteIcon />
                          </Button>
                  </Fragment>
              );     
          },
       },

  ];

  const rows = [];
   
  users && 
      users.forEach((item) => {
          rows.push({
             id: item._id,
             email: item.email,
             role: item.role,
             name: item.name,
          });
      });
  
  return (
      <Fragment>
             <MetaData title={`ALL USERS - Admin`} />

             <div className="dashboard">
                   <Sidebar />
                   <div className="productListContainer">
                       <h1 id="productListHeading">All USERS</h1>
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

export default UsersList;