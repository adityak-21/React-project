import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { verifyToken } from "../api/AuthApi";
import { Loader } from "./Loading";
import { useSelector } from "react-redux";
import { getAccessToken } from "../api/AuthApi";

const ProtectedRoute = ({
  component: Component,
  adminOnly = false,
  ...rest
}) => {
  const token = getAccessToken();
  const [isValid, setIsValid] = useState(null);
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }
      try {
        const response = await verifyToken();
        if (response?.data?.valid === true) {
          if (adminOnly) {
            setIsValid(!!isAdmin);
          } else {
            setIsValid(true);
          }
        } else {
          setIsValid(false);
        }
      } catch (error) {
        setIsValid(false);
      }
    };
    verifyUser();
  }, [token, isAdmin, adminOnly]);

  if (isValid === null) {
    return <Loader />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isValid === true ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
