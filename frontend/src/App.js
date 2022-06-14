import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.js";
import Feed from "./pages/Feed.js";
import SignUp from "./pages/SignUp.js";
import User  from "./pages/User.js";
import "./style.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact={true} path="/" element={<Login/>}/>
          <Route exact={true} path="/signup" element={<SignUp/>}/>
          <Route exact={true} path="/dashboard" element={<Feed/>}/>
          <Route exact={true} path="/user" element={<User/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
