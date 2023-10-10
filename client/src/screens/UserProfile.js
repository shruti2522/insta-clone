
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { UPDATE_FOLLOW_DATA } from "../contexts/types";
import { axiosConfig } from "../config/constants";
// Material-UI Components
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";

const link = "https://i.pinimg.com/564x/80/2a/7a/802a7a792647fc98b1097576762b3785.jpg";
// General Styles
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 935,
		margin: "auto",
		padding: "60px 20px 0",
	},
	avatar_container: { margin: "auto" },
	avatar: { width: 152, height: 152 },
	editButton: {
		marginLeft: 20,
		backgroundColor: "paleturquoise",
	},
	settings: {},
	loaderContainer: {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 9999,
	},

	loader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

const UserProfilePage = () => {
	const classes = useStyles();
	const [value, setValue] = useState("Posts"); // to switch between different tabs
	const { state, dispatch } = useContext(AuthenticationContext);
	console.log('user profile state here', state);
	var uId = useParams();
	console.log('user id', uId.userid);
	uId = uId.userid;
	const userId = localStorage.getItem("searchId");


	const [data, setData] = useState(null);
	// const [showFollow, setShowFollow] = useState(state.user ? !state.user.following.includes(userid) : null);

	const config = axiosConfig();

	useEffect(() => {
		axios.get(process.env.REACT_APP_BACKEND_URL + `/users/show-user-profile?userId=${uId}`, config).then((res) => {
			setData(res.data.data);
		});
	}, []);

	console.log("user data", data);

	return (
		<React.Fragment>
			<CssBaseline />
			{data ? (
				<Box component="main" className={classes.root}>
					<Box mb="44px">
						<Grid container>
							<Grid item xs={4} className={classes.avatar_container}>
								<Avatar
									className={classes.avatar}
									style={{ margin: "auto" }}
									src={`https://res.cloudinary.com/piyushproj/image/upload/v1696914219/${data.username}.png`}
									onError={(e) => { e.target.onerror = null; e.target.src = link }}
								/>
							</Grid>
							<Grid item xs={8}>
								<Box clone mb="20px">
									<Grid container alignItems="center">
										<Typography variant="h5">
											{data ? data.username : "Is Loading ..."}
										</Typography>

										<Button
											className={classes.editButton}
											variant="outlined"
										// onClick={() => followUser()}
										>
											Follow
										</Button>


										<div className={classes.settings}>
											<IconButton component={Link} to="#">
												<Icon>settings</Icon>
											</IconButton>
										</div>
									</Grid>
								</Box>
								<Box mb="20px">
									<Grid container spacing={4}>
										<Grid item>
											<Typography variant="subtitle1">
												<b>
													{data.totalFollower}
												</b>{" "}
												followers
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1">
												<b>
													{data.totalFollowing}
												</b>{" "}
												following
											</Typography>
										</Grid>
									</Grid>
								</Box>
								<Typography variant="h6">{`${data.firstname} ${data.lastname}`}</Typography>
							</Grid>
						</Grid>
					</Box>
					<Tabs
						value={value}
						centered
						onChange={(event, value) => {
							setValue(value);
						}}
						TabIndicatorProps={{
							style: { transform: "translateY(-70px)", backgroundColor: "#262626" },
						}}
					>
						<Tab label="Posts" value="Posts" icon={<Icon>grid_on_outlined</Icon>} />
						<Tab label="IGTV" value="IGTV" icon={<Icon>live_tv</Icon>} disabled />
						<Tab
							label="Tagged"
							value="Tagged"
							icon={<Icon>local_offer_outlined</Icon>}
							disabled
						/>
					</Tabs>
					<TabPanel value={value} index="Posts">
						<Grid container spacing={2}>
							

							<Grid item xs={4} className={classes.post_box}>
								<img
									alt="post"
									style={{ width: "100%", height: "70%" }}
									src="https://source.unsplash.com/random"
								/>
							</Grid>
							<Grid item xs={4} className={classes.post_box}>
								<img
									alt="post"
									style={{ width: "100%", height: "70%" }}
									src="https://source.unsplash.com/random"
								/>
							</Grid>
							<Grid item xs={4} className={classes.post_box}>
								<img
									alt="post"
									style={{ width: "100%", height: "70%" }}
									src="https://source.unsplash.com/random"
								/>
							</Grid>
						</Grid>
					</TabPanel>
				</Box>
			) : (
				<div className={classes.loaderContainer}>
					<div className={classes.loader}>
						<CircularProgress />

					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default UserProfilePage;
