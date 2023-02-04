import { Route, Routes } from "react-router-dom";
import "./assets/css/nucleo-icons.css";
import "./assets/css/scss/blk-design-system-react.scss";
import "./assets/css/demo.css";
import Landing from "./views/Landing";
import Login from "./views/Login";
import Register from "./views/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
