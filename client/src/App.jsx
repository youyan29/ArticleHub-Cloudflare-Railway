import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* login */}
      <Route path="/login" element={<Login />} />

      {/* home */}
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />

      {/* editor */}
      <Route
        path="/editor/:articleId"
        element={token ? <EditorPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
