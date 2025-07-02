import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { verifyToken } from "../api/AuthApi";
import { Loader } from "../common/Loading";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("access_token");
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyUser = () => {
      verifyToken()
        .then((response) => {
          if (response.data.valid === true) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
          setIsValid(false);
        });
    };
    if (token) {
      verifyUser();
    } else {
      setIsValid(false);
    }
  }, []);

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
          (console.log(isValid), (<Redirect to="/login" />))
        )
      }
    />
  );
};

export default PrivateRoute;
