
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationContext from "../contexts/auth/Auth.context";
import { FETCH_USER_DATA } from "../contexts/types.js";
import Copyright from "../components/Copyight";
import { EmailRegex } from "../utils/regex";
import { LOGIN_URL } from "../config/constants";
import axios from "axios";
// Material-UI Components
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { useDispatch } from 'react-redux';
import Cookies from "js-cookie";

// General Styles
const useStyles = makeStyles((theme) => ({
	Logo: {
		fontFamily: "Grand Hotel, cursive",
		margin: "0px 0px 20px 0px",
	},
	paper: {
		marginTop: "50px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	image: {
		backgroundSize: "cover",
		backgroundColor: "#fafafa",
		backgroundImage: "url(https://source.unsplash.com/random)",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		height: "100vh",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(2, 0, 2),
	},
}));

const Login = () => {
	const dispatchUser = useDispatch();

	const navigate = useNavigate();
	const classes = useStyles();
	const [data, setData]=useState({});
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formatValidation, setFormatValidation] = useState(false);
	const [authValidation, setAuthValidation] = useState(false);
	const { dispatch } = useContext(AuthenticationContext);

	const handleInputChanges = (e) => {
		const { name, value } = e.target;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};

	const handleLogin = async () => {
		console.log("entered login route")
	if (EmailRegex.test(email)) {
		try {
		const response = await fetch(LOGIN_URL, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			email,
			password,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message);
		}

		const responseData = await response.json();
		console.log("responseData:", responseData);
		const token = responseData.data.token;
		setData(responseData.data)

		Cookies.set('authToken', token, { expires: 7 });

		// Dispatch the action after setting the cookie
		dispatch({ type: FETCH_USER_DATA, payload: responseData.data });

		navigate("/");
		} catch (error) {
		console.error("Error during sign up:", error);
		if (error.response) {
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);
		}
		}
	} else {
		setAuthValidation(false);
		setFormatValidation(true);
	}
}


  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
	  dispatch({ type: FETCH_USER_DATA, payload: data });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, []);


	return (
		<Grid container>
			<Grid className={classes.image} item sm={4} md={6} />
			<Grid item xs={12} sm={8} md={6}>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<div className={classes.paper}>
						<Typography className={classes.Logo} variant="h2" gutterBottom>
							Instagram Clone
						</Typography>
						{formatValidation ? (
							<Alert variant="outlined" severity="error">
								Invalid Email format — check it out!
							</Alert>
						) : null}
						{authValidation ? (
							<Alert variant="outlined" severity="error">
								Invalid given Email/Password — check it out!
							</Alert>
						) : null}
						<form className={classes.form} noValidate>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
								value={email}
								onChange={handleInputChanges}
							/>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={handleInputChanges}
							/>

							<Button
								fullWidth
								variant="outlined"
								color="primary"
								className={classes.submit}
								disabled={email !== "" && password !== "" ? false : true}
								onClick={handleLogin}
							>
								Sign In
							</Button>
							<Grid container>
								<Grid item xs>
									<Link to="/reset" style={{ textDecoration: "none" }}>
										Forgot password?
									</Link>
								</Grid>
								<Grid item>
									<Link to="/signup" style={{ textDecoration: "none" }}>
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid>
							</Grid>
						</form>
					</div>
					<Box mt={8}>
						<Copyright />
					</Box>
				</Container>
			</Grid>
		</Grid>
	);
};

export default Login;
