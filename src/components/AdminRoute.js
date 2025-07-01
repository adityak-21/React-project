import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Loader } from "../common/Loading";
import { useSelector } from "react-redux";

const AdminRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("access_token");
  const [isValid, setIsValid] = useState(null);
  const isAdm = useSelector((state) => state.admin.isAdmin);

  useEffect(() => {
    if (token) {
      setIsValid(!!isAdm);
    } else {
      setIsValid(false);
    }
  }, [token, isAdm]);

  if (isValid === null) {
    return <Loader />;
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        isValid === true ? (
          <Component {...props} />
        ) : (
          (console.log(isAdm), (<Redirect to="/login" />))
        )
      }
    />
  );
};

export default AdminRoute;
