
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { BOOKMARK_POST } from "../contexts/types.js";
import Navbar from "../components/Navbar";
import { axiosConfig, ALL_POST_URL } from "../config/constants";
// Material-UI Components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// Material-UI Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import SendIcon from "@material-ui/icons/Send";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { formatDistanceToNow } from "date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";



// General style
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 500,
		margin: "20px auto",
		"& .MuiTextField-root": {
			width: "100%",
		},
		"& .MuiOutlinedInput-multiline": {
			paddingTop: "8px",
			paddingBottom: "8px",
			marginTop: "5px",
			marginLeft: "5px",
			marginRight: "5px",
		},
		"& .MuiCardContent-root:last-child": {
			paddingBottom: "10px",
		},
		"& .MuiDivider-middle": {
			marginBottom: "4px",
		},
		"& .MuiListItem-root": {
			padding: "0px 16px",
		},
		"& .MuiCardContent-root": {
			paddingTop: "0px",
			paddingBottom: "5px",
		},
		"& .MuiIconButton-root:focus": {
			backgroundColor: "rgba(0, 0, 0, 0)",
		},
	},
	header: {
		padding: "10px",
	},
	media: {
		//height: 0,
		paddingTop: "56.25%", // 16:9
		height: "max-content",
	},
	likeBar: {
		height: "25px",
		paddingTop: "0px",
		marginTop: "8px",
		marginLeft: "2px",
		paddingLeft: "0px",
		paddingBottom: "4px",
	},
	comments: {
		display: "flex",
		paddingTop: "0px",
		paddingLeft: "12px",
		paddingRight: "0px",
	},
	comment_item_see_more: {
		width: "35%",
		cursor: "pointer",
	},
	comments_icon_see_more: {
		height: "17px",
		width: "17px",
		paddingTop: "4px",
		paddingBottom: "3px",
	},
	comments_icon: {
		height: "30px",
		paddingLeft: "0px",
		paddingTop: "13px",
		paddingRight: "8px",
		paddingBottom: "0px",
	},
	inline: {
		display: "inline",
		fontWeight: "600",
	},
	avatar: {
		height: "40px",
	},
	links: {
		textDecoration: "none",
	},

	loaderContainer: {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center", // Add a semi-transparent background overlay
		zIndex: 9999, // Ensure the loader is on top of everything
	},

	loader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		padding: theme.spacing(2),
	},
}));

const Home = () => {
	const classes = useStyles();
	const { state, dispatch } = useContext(AuthenticationContext);

	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	

	const config = axiosConfig();

	const getUser =  async (id) => {
    try {
      const response =  await axios.get(
        process.env.REACT_APP_BACKEND_URL + `/users/show-user-profile?userId=${id}`,
        config
      );
	  console.log(response.data.data.username)
       return { userId: id, username: response.data.data.username };
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };


	// Modify your axios configuration to include the toke

	useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(ALL_POST_URL, config);
        console.log("POST DATA", response.data.data);

		const fetchedData = response.data.data;

		const userNamesMap = new Map();

		
		for (const item of fetchedData) {
			const userObj = await getUser(item.userId);
			userNamesMap.set(item.userId, userObj);
		}

		const userNames = [...userNamesMap.values()];

		sessionStorage.setItem("data", JSON.stringify(userNames));
		console.log("session cookie set")
		setData(fetchedData);
		setIsLoading(false);
		

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
	

    fetchData();
  }, []);

    const storedData = sessionStorage.getItem("data");
    const parsedData = JSON.parse(storedData);

// Function to retrieve username by userId
	const getUsernameByUserId = (userId) => {
	const userObject = parsedData.find((user) => user.userId === userId);
	return userObject ? userObject.username : null;
	};


	// const likePost = (id) => {
	// 	axios.put(`http://localhost:8000/like`, { postId: id }, config)
	// 		.then((result) => {
	// 			const newData = data.map((item) => {
	// 				if (result.data._id === item._id) return result.data;
	// 				else return item;
	// 			});
	// 			setData(newData);
	// 		})
	// 		.catch((err) => console.log(err));
	// };

	// const unlikePost = (id) => {
	// 	axios.put(`http://localhost:8000/Unlike`, { postId: id }, config)
	// 		.then((res) => {
	// 			const newData = data.map((item) => {
	// 				if (res.data._id === item._id) return res.data;
	// 				else return item;
	// 			});
	// 			setData(newData);
	// 		})
	// 		.catch((err) => console.log(err));
	// };

	// const bookmark = (id) => {
	// 	axios.put(`http://localhost:8000/bookmark-post`, { postId: id }, config)
	// 		.then((result) => {
	// 			console.log("result", result.data.bookmarks)
	// 			dispatch({
	// 				type: BOOKMARK_POST,
	// 				payload: { bookmarks: result.data.bookmarks },
	// 			});
	// 			localStorage.setItem("user", JSON.stringify(result.data));
	// 		})
	// 		.catch((err) => console.log(err));
	// };

	// const removeBookmark = (id) => {
	// 	axios.put(`http://localhost:8000/remove-bookmark`, { postId: id }, config)
	// 		.then((result) => {
	// 			dispatch({
	// 				type: BOOKMARK_POST,
	// 				payload: { bookmarks: result.data.bookmarks },
	// 			});
	// 			localStorage.setItem("user", JSON.stringify(result.data));
	// 		})
	// 		.catch((err) => console.log(err));
	// };

	// const makeComment = (text, postId) => {
	// 	setComment("");
	// 	axios.put(`http://localhost:8000/comment`, { text, postId }, config)
	// 		.then((result) => {
	// 			const newData = data.map((item) => {
	// 				if (result.data._id === item._id) return result.data;
	// 				else return item;
	// 			});
	// 			setData(newData);
	// 		})
	// 		.catch((err) => console.log(err));
	// 	setComment("");
	// };

	// const deletePost = (postId) => {
	// 	axios.delete(`http://localhost:8000/deletepost/${postId}`, config).then((res) => {
	// 		const newData = data.filter((item) => {
	// 			return item._id !== res.data;
	// 		});
	// 		setData(newData);
	// 	});
	// };


	console.log("data", data)
	console.log("state", state)

	return (
		<>
		<Navbar />
			

			{isLoading ? (
				<div className={classes.loaderContainer}>
				 <div className={classes.loader}>
					 <CircularProgress /> 

				 </div>
				</div>
     // Show loader
    ) : (data.map((item) => (

				<div className="home" key={item._id}>
					<Card className={classes.root}>
						<CardHeader
							className={classes.header}
							avatar={
								<Avatar>
									<img
										className={classes.avatar}
										alt=""
										src={'https://i.pinimg.com/564x/80/2a/7a/802a7a792647fc98b1097576762b3785.jpg'}
									/>
								</Avatar>
							}
							title={
								<Link
									className={classes.links}
									to={
										item.userId !== state.user._id
											? `/profile/${item.userId}`
											: "/profile"
									}
								>
									{getUsernameByUserId(item.userId)} <br /> {item.title}
									
								</Link>
							}
							subheader={formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
							
						/>

						<CardMedia
							className={classes.media}
							image='https://i.pinimg.com/564x/44/b3/81/44b38139ca8cb39f8ee346ac3c203118.jpg'
							title={item.title}
						/>

						<CardActions className={classes.likeBar} disableSpacing>
								<IconButton
									aria-label="Like"
									color="secondary"
									onClick={() => {
										// unlikePost(item._id);
									}}
								>
									<FavoriteBorderIcon />
								</IconButton>
							<IconButton aria-label="comments">
								<ChatBubbleOutlineIcon />
							</IconButton>
							<IconButton
									aria-label="Remove Bookmark"
									style={{ marginLeft: "auto", color: "#e0d011" }}
									// onClick={() => {
									// 	removeBookmark(item._id);
									// }}
								>
									<BookmarkBorderIcon />
								</IconButton>
						</CardActions>

						<CardContent>
							<Typography variant="subtitle2" display="block" gutterBottom>
							
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								{item.description}
							</Typography>
						</CardContent>

						<Divider variant="middle" />

						{/* <List>
							{item.comments.map((cmt, index) => {
								if (!showAllComments[item._id] && index >= 2) {
									return null;
								}
								return (
									<ListItem
										className={classes.comment_item}
										alignItems="flex-start"
										key={cmt._id}
									>
										<ListItemText
											secondary={
												<React.Fragment>
													<Typography
														component="span"
														variant="body2"
														className={classes.inline}
														color="textPrimary"
													>
														<Link
															className={classes.links}
															to={
																cmt.postedBy._id !== state.user._id
																	? `/profile/${cmt.postedBy._id}`
																	: "/profile"
															}
														>
															{cmt.postedBy.username}
														</Link>
													</Typography>
													{" — "}
													{cmt.text}
												</React.Fragment>
											}
										/>
									</ListItem>
								);
							})}
							{item.comments.length === 0 ? (
								<ListItem alignItems="flex-start" style={{ left: "38%" }}>
									<Typography variant="caption" display="block" gutterBottom>
										No comments yet
									</Typography>
								</ListItem>
							) : null}
							{item.comments.length > 2 && item.comments.length !== 0 ? (
								<ListItem
									alignItems="flex-start"
									className={classes.comment_item_see_more}
									onClick={() => {
										setShowAllComments((prevShowAllComments) => ({
											...prevShowAllComments,
											[item._id]: !prevShowAllComments[item._id],
										}));
									}}
								>
									<Typography variant="caption" display="block" gutterBottom>
										{showAllComments[item._id]
											? `Hide all comments`
											: `See all ${item.comments.length} comments`}
									</Typography>
									<DoubleArrowIcon className={classes.comments_icon_see_more} />
								</ListItem>
							) : null}
						</List>

						<Divider variant="middle" />

						<CardContent className={classes.comments}>
							<Avatar>
								<img
									className={classes.avatar}
									alt=""
									src="https://images.unsplash.com/photo-1537815749002-de6a533c64db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
								/>
							</Avatar>
							<TextField
								multiline
								rows={1}
								placeholder="Add your comment..."
								variant="outlined"
								value={comment}
								onChange={(event) => {
									event.preventDefault();
									setComment(event.target.value);
									setShowSend(true);
									if (event.target.value === "") setShowSend(false);
								}}
							/>
							<IconButton
								aria-label="add to favorites"
								className={classes.comments_icon}
								disabled={!showSend}
								onClick={() => makeComment(comment, item._id)}
							>
								<SendIcon />
							</IconButton> */}
						{/* </CardContent> */}
					</Card>
				</div>
			
			)))}

		
		</>
	);
};

export default Home;
