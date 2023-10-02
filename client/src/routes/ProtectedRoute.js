import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthenticationContext from "../contexts/auth/Auth.context";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const { state } = useContext(AuthenticationContext);

  // Check if the user is authenticated
  const isAuthenticated = state.isAuthenticated;


	// Check if the user is authenticated
  
	// If authorized, return an outlet that will render child elements
	// If not, return a Navigate component that will navigate to the login page
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

};

export default ProtectedRoute;
