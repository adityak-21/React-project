import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { verifyAdmin } from "../api/AuthApi";
import { Loader } from "../common/Loading";

const AdminRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("access_token");
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verify = () => {
      verifyAdmin()
        .then((response) => {
          setIsValid(true);
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
          setIsValid(false);
        });
    };
    if (token) {
      verify();
    } else {
      setIsValid(false);
    }
    // console.log(isValid);
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

export default AdminRoute;
