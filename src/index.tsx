import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import "firebase/auth";
import "./input.css";
import "./firebase";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
