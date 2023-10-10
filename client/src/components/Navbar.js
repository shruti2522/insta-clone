

//Navbar

import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { LOGOUT } from "../contexts/types";
import Axios from "axios";
import LogoutModal from "./Logout";
// Material-UI Components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Modal from "@material-ui/core/Modal";

// Material-UI Icons
import MoreIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AllInboxOutlinedIcon from "@material-ui/icons/AllInboxOutlined";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import Cookies from "js-cookie";
import { axiosConfig } from "../config/constants";
import axios from "axios";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	inline: {
		display: "inline",
	},
	grow: {
		flexGrow: 1,
	},
	title: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
		},
		fontFamily: "Grand Hotel, cursive",
		color: "rgba(0, 0, 0, 0.54)",
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: "rgba(0, 0, 0, 0.075)",
		"&:hover": {
			backgroundColor: "rgba(0, 0, 0, 0.03)",
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
		margin: "0px auto",
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "rgba(0, 0, 0, 0.54)",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "30ch",
		},
		color: "#000000",
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
		},
	},
	sectionMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "1px solid rgba(0, 0, 0, 0.015)",
		boxShadow: theme.shadows[4],
		padding: theme.spacing(2, 4, 3),
		borderRadius: "10px",
		"&:focus": {
			border: "1px solid rgba(0, 0, 0, 0.015)",
		},
	},
	links: {
		textDecoration: "none",
	},
}));

const getModalStyle = () => {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
		border: "1px solid rgba(0, 0, 0, 0.015)",
	};
};

const Navbar = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { state, dispatch } = useContext(AuthenticationContext);
	const navigate = useNavigate();
	const [search, setSearch] = useState([]);
	const [searchValue, setSearchValue] = useState("");

	// Material-Ui
	const classes = useStyles();
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [openModal, setOpenModal] = useState(false);

	


	const config = axiosConfig();

	const handleOpenModal = () => {
		handleMobileMenuClose();
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const handleLogOut = () => {
		Cookies.remove('authToken');
		//sessionStorage all clear
		sessionStorage.clear();
		dispatch({ type: LOGOUT });
		navigate("/login");
	};
    const onLogout = () => {
		console.log("logout");
		handleLogOut();
	};
	
	const storedData = sessionStorage.getItem("data");
	const parsedData = JSON.parse(storedData);
	console.log("parsedData", parsedData)

	const searchUser = async (username) => {
		const userObject = parsedData.find((user) => user.username === username);
		console.log("userObject", userObject)
		const userId = userObject ? userObject.userId : null;

		localStorage.setItem("searchId", userId);
        
		const userProfileUrl = `${process.env.REACT_APP_BACKEND_URL}/users/show-user-profile?userId=${userId}`;

		const response = await axios.get(userProfileUrl, config);
		console.log("search", response.data.data);
		setSearch(response.data.data);

		return response.data.data;
	};
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			// User pressed Enter, construct the profile URL and navigate to it
			if (searchValue) {
				searchUser(searchValue);
			const x=	localStorage.getItem("searchId");
				
				navigate(`/profile/${x}`);

			}
		}
	};
	const id = useParams();

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem onClick={handleOpenModal}>
				<IconButton>
					<SearchOutlinedIcon style={{ "color": "rgba(0, 0, 0, 0.54)" }} />
				</IconButton>
				<p>Search</p>
			</MenuItem>
			<MenuItem component={Link} to="/explore">
				<IconButton>
					<ExploreOutlinedIcon
						style={{
							"color": "rgba(0, 0, 0, 0.54)",
						}}
					/>
				</IconButton>
				<p>Explore</p>
			</MenuItem>
			<MenuItem component={Link} to="/create">
				<IconButton>
					<AddAPhotoOutlinedIcon
						style={{
							"color": "rgba(0, 0, 0, 0.54)",
						}}
					/>
				</IconButton>
				<p>Add Post</p>
			</MenuItem>
			<MenuItem component={Link} to="#">
				<IconButton>
					<Badge
						badgeContent={4}
						color="secondary"
						style={{
							"color": "rgba(0, 0, 0, 0.54)",
						}}
					>
						<AllInboxOutlinedIcon />
					</Badge>
				</IconButton>
				<p>Messages</p>
			</MenuItem>

			<MenuItem component={Link} to="#">
				<IconButton>
					<Badge badgeContent={6} color="secondary">
						<NotificationsActiveOutlinedIcon
							style={{
								"color": "rgba(0, 0, 0, 0.54)",
							}}
						/>
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem component={Link} to="/profile">
				<IconButton>
					<AccountCircleOutlinedIcon
						style={{
							"color": "rgba(0, 0, 0, 0.54)",
						}}
					/>
				</IconButton>
				<p>Profile</p>
			</MenuItem>
			<MenuItem onClick={handleLogOut}>
				<IconButton>
					<ExitToAppOutlinedIcon
						style={{
							"color": "rgba(0, 0, 0, 0.54)",
						}}
					/>
				</IconButton>
				<p>LogOut</p>
			</MenuItem>
		</Menu>
	);
	const modalBody = (
		<div style={modalStyle} className={classes.paper}>
			<div className={classes.search} style={{ "margin": "0px auto" }}>
				<div className={classes.searchIcon}>
					<SearchOutlinedIcon style={{ "color": "rgba(0, 0, 0, 0.54)" }} />
				</div>
				<InputBase
					placeholder=" Search…"
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					inputProps={{ "aria-label": "search" }}
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onKeyPress={handleKeyPress}

				/>
			</div>
			<List className={classes.root}>
				{search.user
					? search.user.map((item) => {
						return (
							<Link
								className={classes.links}
							// key={userId}
							// to={userId !== state.user._id ? `/profile/${item._id}` : "/profile"}
							// onClick={handleCloseModal}
							>
								<Divider
									variant="inset"
									component="li"
									style={{ marginLeft: "0px" }}
								/>
								<ListItem alignItems="flex-start">
									<ListItemAvatar>
										<Avatar
											alt="Remy Sharp"
											src="/static/images/avatar/1.jpg"
										/>
									</ListItemAvatar>
									<ListItemText
										primary={item.username}
									// secondary={
									//  <React.Fragment>{item.email}</React.Fragment>
									// }
									/>
								</ListItem>
							</Link>
						);
					})
					: null}
			</List>
		</div>
	);

	return (
		<nav>
			<div className={classes.grow}>
				<AppBar position="static" style={{ "backgroundColor": "#ffffff" }}>
					<Toolbar>
						<Link to={state ? "/" : "/login"} className={classes.links}>
							<Typography className={classes.title} variant="h4" noWrap>
								Instagram Clone
							</Typography>
						</Link>
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<BottomNavigation>
								<BottomNavigationAction
									label="Search"
									value="search"
									onClick={handleOpenModal}
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									icon={
										<SearchOutlinedIcon
											style={{ "color": "rgba(0, 0, 0, 0.54)" }}
										/>
									}
								/>
								<BottomNavigationAction
									label="Home"
									value="home"
									component={Link}
									to="/"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									icon={
										<HomeOutlinedIcon
											style={{
												"color": "rgba(0, 0, 0, 0.54)",
											}}
										/>
									}
								/>
								<BottomNavigationAction
									label="Explore"
									value="explore"
									component={Link}
									to="/explore"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									icon={
										<ExploreOutlinedIcon
											style={{
												"color": "rgba(0, 0, 0, 0.54)",
											}}
										/>
									}
								/>

								<BottomNavigationAction
									label="Add Post"
									value="add post"
									component={Link}
									to="/create"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									icon={
										<AddAPhotoOutlinedIcon
											style={{
												"color": "rgba(0, 0, 0, 0.54)",
											}}
										/>
									}
								/>
								<BottomNavigationAction
									label="Messages"
									value="messages"
									component={Link}
									to="/messages"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									icon={
										<Badge
											badgeContent={4}
											color="secondary"
											style={{
												"color": "rgba(0, 0, 0, 0.54)",
											}}
										>
											<AllInboxOutlinedIcon />
										</Badge>
									}
								/>
								<BottomNavigationAction
									label="Notifications"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									value="notification"
									icon={
										<Badge badgeContent={6} color="secondary">
											<NotificationsActiveOutlinedIcon
												style={{
													"color": "rgba(0, 0, 0, 0.54)",
												}}
											/>
										</Badge>
									}
								/>
								<BottomNavigationAction
									label="Profile"
									value="profile"
									component={Link}
									to="/profile"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									icon={
										<AccountCircleOutlinedIcon
											style={{
												"color": "rgba(0, 0, 0, 0.54)",
											}}
										/>
									}
								/>
							
								<BottomNavigationAction
									label="Logout"
									style={{ "color": "rgba(0, 0, 0, 0.54)" }}
									value="logout"
									onClick={() => setIsModalOpen(true)}
									icon={
										<ExitToAppOutlinedIcon
											style={{
												"color": "rgba(0, 0, 0, 0.54)",
											}}
										/>
									}
								/>
							</BottomNavigation>
							<LogoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogout={onLogout} />

						</div>
						<div className={classes.sectionMobile}>
							<IconButton
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MoreIcon style={{ "color": "rgba(0, 0, 0, 0.54)" }} />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{renderMobileMenu}
			</div>
			<Modal open={openModal} onClose={handleCloseModal}>
				{modalBody}
			</Modal>
		</nav>
	);
};

export default Navbar;
