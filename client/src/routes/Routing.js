import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AuthContext from "../contexts/auth/Auth.context";
import ProtectedRoute from "./ProtectedRoute";

// different routes
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import CreatePost from "../screens/CreatePost.js";
import Profile from "../screens/Profile";
import UserProfile from "../screens/UserProfile";
import Messages from "../screens/Messages";
import Chat from "../screens/Chat";
import SubscribePost from "../screens/SubscribePosts";
import Reset from "../screens/ResetPassword.js";
import NewPass from "../screens/NewPassword.js";
import Cookies from 'js-cookie';

import Explore from "../screens/Explore";
const Routing = () => {

	const { state, dispatch } = useContext(AuthContext);

	useEffect(() => {
		const token = Cookies.get('authToken')

		if (token) {
			dispatch({ type: "FETCH_USER_DATA" }); 
		} else {
			dispatch({ type: "LOGOUT" }); 
		}
	}, [dispatch]);

	return (
		<Router>
			<Routes>
				{/* Public routes */}

				<Route path="/login" element={<Login />} />

				<Route path="/signup" element={<Signup />} />
				<Route path="/reset" element={<Reset />} />
				<Route path="/reset/:token" element={<NewPass />} />
				<Route exact path='/' element={<ProtectedRoute />}>
					<Route exact path='/' element={<Home />} />
				</Route>
				<Route exact path='/explore' element={<ProtectedRoute />}>
					<Route exact path='/explore' element={<Explore />} />
				</Route>
				<Route exact path='/create' element={<ProtectedRoute />}>
					<Route exact path='/create' element={<CreatePost />} />
				</Route>
				<Route exact path='/profile' element={<ProtectedRoute />}>
					<Route exact path='/profile' element={<Profile />} />
				</Route>
				<Route exact path='/profile/:userid' element={<ProtectedRoute />}>
					<Route exact path='/profile/:userid' element={<UserProfile />} />
				</Route>
				<Route exact path='/messages' element={<ProtectedRoute />}>
					<Route exact path='/messages' element={<Messages />} />
				</Route>
				<Route exact path='/chat/:username' element={<ProtectedRoute />}>
					<Route exact path='/chat/:username' element={<Chat />} />
				</Route>



			</Routes>
		</Router>
	);
};


export default Routing;
