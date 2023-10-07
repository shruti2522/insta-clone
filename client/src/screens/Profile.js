
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import VerticalTabs from "../components/VerticalTabs.js";
import Navbar from "../components/Navbar";
import { axiosConfig, MY_POST_URL, MY_BOOKMARKS_URL } from "../config/constants";

// Material-UI Components
import { makeStyles, withStyles } from "@material-ui/styles";
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
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";

// Material-UI Icons
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

// General styles
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 935,
    margin: "auto",
    padding: "60px 20px 0",
  },
  dialogContainer: {
    "& .MuiDialog-paperWidthSm": {
      width: "80%",
      maxWidth: "900px",
    },
  },
  dialogTitle: {
    margin: "0px",
    padding: "16px",
  },
  avatar_container: { margin: "auto" },
  avatar: { width: 152, height: 152 },
  editButton: {
    marginLeft: 20,
  },
  settings: {},
  posts: {
    width: "270px",
    height: "230px",
  },
  posts_img: {
    width: "100%",
    height: "100%",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  closeButton: {
    position: "absolute",
    right: "8px",
    top: "8px",
    color: "#9e9e9e",
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
  },
}));

// EditProfile dialog content style
const DialogContent = withStyles((theme) => ({
  root: {
    padding: "16px",
  },
}))(MuiDialogContent);

// EditProfile dialog actions style
const DialogActions = withStyles((theme) => ({
  root: {
    margin: "0px",
    padding: "2px",
  },
}))(MuiDialogActions);

// Tabs data container
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const ProfilePage = () => {
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
  const classes = useStyles();
  const { state } = useContext(AuthenticationContext);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [value, setValue] = useState("Posts");
  const [isLoading, setIsLoading] = useState(true);

  const link = "https://i.pinimg.com/564x/80/2a/7a/802a7a792647fc98b1097576762b3785.jpg";

  console.log("profile page state", state)
  useEffect(() => {
    const followerss = JSON.parse(sessionStorage.getItem("followers"));
    if (followerss) {
      console.log("profile page followerss", followerss)
      setFollowers(JSON.parse(sessionStorage.getItem("followers")));
     
    }
    // console.log(followers, "followers")
    // console.log(JSON.parse(sessionStorage.getItem("followers")),"followerrss")
    const profies = JSON.parse(sessionStorage.getItem("profile"));
    if (profies) {
      console.log("profile page profies", profies)
      setData(profies.posts);
      setUserData(profies);
      setIsLoading(false);
    }
    else {
      axios.get(MY_POST_URL, config).then((res) => {
        console.log("profile page res", res.data.data.posts)
        setData(res.data.data.posts);
        setUserData(res.data.data);
        console.log(res.data.data);
        setIsLoading(false);
        sessionStorage.setItem("followers", JSON.stringify(res.data.data.follower));
        console.log(res.data.data.follower)
        sessionStorage.setItem("profile", JSON.stringify(res.data.data));
      });
    }
    const userNames=new Map();
    const getFollowers = async () => {
      const followers = await Promise.all(
        profies.follower.map((follower) => getUser(follower.followerId))
      );
      console.log("profile page followers", followers)
      setFollowers(followers);
      sessionStorage.setItem("followers", JSON.stringify(followers));
    };
    getFollowers();


  }, []);

  //Toggle the EditProfile Button to show the Dialog
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditClickOpen = () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };

  return (
    <>
      <Navbar />
      <CssBaseline />
      <Box component="main" className={classes.root}>
        {isLoading ? (
          <div className={classes.loaderContainer}>
            <div className={classes.loader}>
              <CircularProgress />

            </div>
          </div>
        ) : (
          <>
            {/* User Profile Data Goes Here */}
            <Box mb="44px">
              <Grid container>
                <Grid item xs={4} className={classes.avatar_container}>
                  <Avatar
                    className={classes.avatar}
                    style={{ margin: "auto" }}
                    src="https://i.pinimg.com/564x/80/2a/7a/802a7a792647fc98b1097576762b3785.jpg"
                  />
                </Grid>
                <Grid item xs={8}>
                  <Box clone mb="20px">
                    <Grid container alignItems="center">
                      <Typography variant="h5">
                        {userData.username}
                      </Typography>
                      <Button
                        className={classes.editButton}
                        variant="outlined"
                        onClick={handleEditClickOpen}
                      >
                        Edit Profile
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
                          <b>{data.length}</b> posts
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1">
                          <button style={{ border: 'none', background: 'none', padding: '0', font: 'inherit' }}
                            onClick={() => setShowFollowers(true)}
                          >
                            <b>{userData.totalFollower}</b> followers
                          </button>   </Typography>

                      </Grid>
                      {showFollowers && (
  <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: '9999' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', width: '50%', height: '50%', overflow: 'scroll' }}>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #dbdbdb' }}>
     <center>  <h3>Followers</h3></center> 
        {console.log(followers, "followers")}
        <button style={{ border: 'none', background: 'none', padding: '0', font: 'inherit' }} onClick={() => setShowFollowers(false)}>
          <Icon>close</Icon>
        </button>
      </div>

      {followers.map((item) => (
  <div key={item.id} style={{ padding: '10px 20px', borderBottom: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar
        className={classes.avatar}
        style={{ margin: 'auto', width: '30px', height: '30px' }}
        src="https://i.pinimg.com/564x/80/2a/7a/802a7a792647fc98b1097576762b3785.jpg"
      />
      <div style={{ marginLeft: '10px' }}>
        <h1>{item.username}</h1>
        {/* Add any additional information here */}
        {/* <p>{item.email}</p> */}
      </div>
    </div>
    <button style={{ border: 'none', background: 'none', padding: '0', font: 'inherit' }}>
      <Icon>check</Icon>
    </button>
  </div>
))}

    </div>
  </div>
)}



                      <Grid item>
                        <Typography variant="subtitle1">
                          <b>{userData.totalFollowing}</b> following
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Typography variant="h6">{`${userData.firstname} ${userData.lastname}`}</Typography>
                </Grid>
              </Grid>
            </Box>
            {/* Tabs Goes Reference Here */}
            <Tabs
              value={value}
              centered
              onChange={(event, value) => {
                setValue(value);
              }}
              TabIndicatorProps={{
                style: {
                  transform: "translateY(-70px)",
                  backgroundColor: "#262626",
                },
              }}
            >
              <Tab label="Posts" value="Posts" icon={<Icon>grid_on_outlined</Icon>} />
              <Tab label="IGTV" value="IGTV" icon={<Icon>live_tv</Icon>} disabled />
              <Tab label="Saved" value="Saved" icon={<Icon>bookmark_border_outlined</Icon>} />
              <Tab
                label="Tagged"
                value="Tagged"
                icon={<Icon>local_offer_outlined</Icon>}
                disabled
              />
            </Tabs>
            <TabPanel value={value} index="Posts">
              <Grid container spacing={2}>
                {data.map((item) => (
                  <Grid item xs={4} key={item.id} className={classes.posts}>
                    <img
                      className={classes.posts_img}
                      alt="post"
                      src={`https://res.cloudinary.com/piyushproj/image/upload/v1696626899/${item._id}.png`}
                      onError={(e) => { e.target.onerror = null; e.target.src = link }}
                      onClick={((e) => {
                        console.log(item._id)
                      })}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index="Saved">
              {/* <GridList cellHeight={230} cols={3} spacing={15}>
                {bookmarks.map((item) => (
                  <GridListTile key={item._id}>
                    <img
                      src=
                      alt={item.title}
                    />
                    <GridListTileBar
                      title={item.title}
                      subtitle={<span>By : {item.postedBy.username}</span>}
                      actionIcon={
                        <IconButton
                          aria-label={`info about`}
                          className={classes.icon}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </GridListTile>
                ))}
              </GridList> */}
            </TabPanel>
          </>
        )}
      </Box>
      {/* EditProfile Dialog */}
      <Dialog onClose={handleEditClose} open={openEdit} className={classes.dialogContainer}>
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <Typography variant="h6">Profile settings</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleEditClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <VerticalTabs />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleEditClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfilePage;





