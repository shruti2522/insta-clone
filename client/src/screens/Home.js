
//Home 
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./like.module.css"
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { BOOKMARK_POST } from "../contexts/types.js";
import Navbar from "../components/Navbar";
import { axiosConfig, ALL_POST_URL } from "../config/constants";
// Material-UI Components
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
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
import { Translate } from "@material-ui/icons";


const link = "https://i.pinimg.com/564x/80/2a/7a/802a7a792647fc98b1097576762b3785.jpg";

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
  heartEmoji: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2rem',
    color: '#ff1744',
    opacity: '0',
    animation: 'pop-up 0.5s ease-in-out',
    zIndex: 99999
  },


}));


const Home = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(AuthenticationContext);


  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [showHeartMap, setShowHeartMap] = useState({});

  const toggleHeart = (itemId) => {
    setShowHeartMap((prevMap) => ({
      ...prevMap,
      [itemId]: true,
    }));
    setTimeout(() => {
      setShowHeartMap((prevMap) => ({
        ...prevMap,
        [itemId]: false,
      }));
    }, 2000);
  };
  const config = axiosConfig();

  const getUser = async (id) => {
    try {
      const response = await axios.get(
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
    // sessionStorage.setItem("followers", JSON.stringify([]));
    const fetchData = async () => {
      if (sessionStorage.getItem("posts")) {
        setData(JSON.parse(sessionStorage.getItem("posts")));
        setIsLoading(false);
        return;
      }
      try {

        const response = await axios.get(ALL_POST_URL, config);
        console.log("POST DATA", response.data.data);

        const fetchedData = response.data.data;
        sessionStorage.setItem("posts", JSON.stringify(fetchedData));


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
      ) : (
        <Grid container spacing={3}>
          {data.map((item) => (
            
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            {console.log("itemdata", data)}
              <Card className={classes.root}>
                <CardHeader
                  className={classes.header}
                  avatar={
                    <Avatar>
                      <img
                        className={classes.avatar}
                        alt=""
                        src={`https://res.cloudinary.com/piyushproj/image/upload/v1696914219/${getUsernameByUserId(item.userId)}.png`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = link;
                        }}
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
                  subheader={formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                  })}
                />

                <CardMedia
                  className={classes.media}
                  image={`https://res.cloudinary.com/piyushproj/image/upload/v1696626899/${item._id}.png`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.image =
                      "https://res.cloudinary.com/piyushproj/image/upload/v1696626899/placeholder.png";
                  }}
                  onClick={() => {
                    // navigate(`/post/${item._id}`);
                    console.log("clicked");
                  }}
                  title={item.title}
                />

                <CardActions className={classes.likeBar} disableSpacing>

                <IconButton
                    aria-label="Like"
                    color="secondary"
                    onClick={() => {
                      toggleHeart(item._id);
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
                  >
                    <BookmarkBorderIcon />
                  </IconButton>
                </CardActions>

                <CardContent>
                  <Typography variant="subtitle2" display="block" gutterBottom></Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {item.description}
                  </Typography>
                </CardContent>

                <Divider variant="middle" />
              </Card>
            

              {showHeartMap[item._id] && (
                <div className="heartEmoji">❤️</div>
              )}
            
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
export default Home;