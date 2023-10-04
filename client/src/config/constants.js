/**
 *
 * @author Anass Ferrak aka " TheLordA " <an.ferrak@gmail.com>
 * GitHub repo: https://github.com/TheLordA/Instagram-Web-App-MERN-Stack-Clone
 *
 */

/**
 *  This File will Contains all Constants Used in the whole
 *  Client Code In order to make it more Cleaner
 */

// This is the config used in order to send
// our token with Axios requests
import Cookies from "js-cookie";

export const axiosConfig = () => {
  const token = Cookies.get('authToken');
  return {
    headers: {
      Authorization: token,
    },
  };
};


/**
 * EndPoints of the API used in the code
 */

// CreatePost Screen
const url = process.env.REACT_APP_BACKEND_URL;

export const CREATE_POST_URL = url+'/posts/create-post';

// Home Screen
export const ALL_POST_URL = url+'/posts/get-feed-post';

// Login Screen
export const LOGIN_URL = url+'/auth/login';

// NewPassword Screen
export const NEW_PWD_URL = `http://localhost:8000/new-pwd`;

// Profile Screen
export const MY_POST_URL = `http://localhost:8000/mypost`;
export const MY_BOOKMARKS_URL = `http://localhost:8000/bookmarks`;

// ResetPassword Screen
export const RESET_PWD_URL = `http://localhost:8000/reset-pwd`;

// SignUp Screen
export const SIGNUP_URL = url+'/auth/signup';

// SubscribePosts Screen
export const SUB_POST_URL = `http://localhost:8000/subspost`;
