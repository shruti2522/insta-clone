import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthenticationContext from "../contexts/auth/Auth.context";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const { state } = useContext(AuthenticationContext);
  const isAuthenticated = state.isAuthenticated;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

};

export default ProtectedRoute;
