import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

// basically ProtectedRoute redirect the user to login Page if he is not loggedin
// ..rest is the all the information available on a particular route.
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);
    return (
          <Fragment>
              {loading === false && (
                  <Route {...rest}
                    // we have "render" prop on the route
                    render={(props) => {
                        if(isAuthenticated === false){
                            return <Redirect to="/login" />;
                        }
                        if(isAdmin === true && user.role !== "admin") {
                            // return <Redirect to= { {path: "/", state: {from: props.location} }} />; can also be done by this way 
                            // from mein ham vo location likhte hai jha se redirect hona chahiye
                            return <Redirect to="/login" />;
                        }
                        return <Component {...props} />;
                    }}
                   />
              )}
          </Fragment>
    );
};

// in "render" prop we have to show which component we want to render

export default ProtectedRoute;