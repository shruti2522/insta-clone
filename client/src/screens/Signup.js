import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmailRegex } from "../utils/regex";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { signUp } from "../slice/authSlice";
import { useDispatch } from "react-redux";
import Copyright from "../components/Copyight";
const useStyles = makeStyles((theme) => ({
  Logo: {
    fontFamily: "Grand Hotel, cursive",
    marginBottom: "42px",
    width: "fit-content",
    margin: "0px auto",
    marginTop: "40px",
  },
  paper: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "200px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
}));

const Signup = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formatValidation, setFormatValidation] = useState(false);
  const [authValidation, setAuthValidation] = useState(false);
  const [confirmValidation, setConfirmValidation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // Create a preview URL for the selected image
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const addImg = (pics, email) => {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      data.append("public_id", email);
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "firstname") {
      setFirstname(value);
    } else if (name === "lastname") {
      setLastname(value);
    }
  };

  const handleSignUp = async () => {
    if (!EmailRegex.test(email)) {
      setFormatValidation(true);
      return;
    }
    try {
      // Upload the image first
      if (selectedImage) {
        await addImg(selectedImage, username);
      }

      // Then, proceed with user registration
      dispatch(signUp({ firstname, lastname, username, email, password }));
      navigate("/login");
    } catch (error) {
      setAuthValidation(true);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography className={classes.Logo} variant="h2">
          Instagram Clone
        </Typography>
        {formatValidation ? (
          <Alert variant="outlined" severity="error">
            Invalid Email format — check it out!
          </Alert>
        ) : null}
        {authValidation ? (
          <Alert variant="outlined" severity="error">
            This Email is already taken — check it out!
          </Alert>
        ) : null}
        {confirmValidation ? (
          <Alert variant="outlined" severity="success">
            Your account has been created successfully — check it out!
          </Alert>
        ) : null}
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="FirstName"
                  name="firstname"
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                  value={firstname}
                  onChange={handleInputChanges}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="LastName"
                  name="lastname"
                  variant="outlined"
                  required
                  fullWidth
                  label="Last Name"
                  value={lastname}
                  onChange={handleInputChanges}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="UserName"
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={handleInputChanges}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleInputChanges}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleInputChanges}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                  >
                    Upload Profile Image
                  </Button>
                </label>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.submit}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>

      {/* Image Preview Modal */}
      <Modal
        aria-labelledby="image-preview-modal"
        aria-describedby="image-preview"
        className={classes.modal}
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.modalContent}>
            <img
              src={imagePreview}
              alt="Profile Preview"
              className={classes.imagePreview}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default Signup;
