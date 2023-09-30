import React from "react";
import { Provider } from "react-redux"; // Import Provider from react-redux
import AuthentificationState from "./contexts/auth/Auth.state";
import Routing from "./routes/Routing";
import "./App.css";
import store from "./store/store";

const App = () => {
  return (
    <Provider store={store}> {/* Wrap with Provider */}
      <AuthentificationState>
        <Routing />
      </AuthentificationState>
    </Provider>
  );
};

export default App;
