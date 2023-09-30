import React, { useEffect, useContext } from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";

import AuthContext from "../contexts/auth/Auth.context";
import ProtectedRoute from "./ProtectedRoute";

// different routes
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import CreatePost from "../screens/CreatePost.js";
import Profile from "../screens/Profile";
import UserProfile from "../screens/UserProfile";
import SubscribePost from "../screens/SubscribePosts";
import Reset from "../screens/ResetPassword.js";
import NewPass from "../screens/NewPassword.js";
import Cookies from 'js-cookie';


const Routing = () => {

	const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const token = Cookies.get('authToken')

    if (token) {
      dispatch({ type: "FETCH_USER_DATA" }); // You should have a LOGIN action in your context
    } else {
      dispatch({ type: "LOGOUT" }); // You should have a LOGOUT action in your context
    }
  }, [dispatch]);

	return (
		<BrowserRouter>
			<Switch>
				{/* Public routes */}
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={Signup} />
				<Route exact path="/reset" component={Reset} />
				<Route exact path="/reset/:token" component={NewPass} />

				{/* Protected routes */}
				<ProtectedRoute exact path="/" component={SubscribePost}  />
				<ProtectedRoute exact path="/explore" component={Home}  />
				<ProtectedRoute exact path="/create" component={CreatePost}  />
				<ProtectedRoute exact path="/profile" component={Profile}  />
				<ProtectedRoute exact path="/profile/:userid" component={UserProfile}  />
			</Switch>
		</BrowserRouter>
	);
};


export default Routing;
