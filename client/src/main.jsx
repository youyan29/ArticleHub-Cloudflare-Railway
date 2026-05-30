import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import api from "./api";

api.defaults.baseURL = "http://localhost:5000";

api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
