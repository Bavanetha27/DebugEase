import {useContext} from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "./AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const NavBar = () => {
  const { user, dispatch } = useContext(AuthContext);
  axios.defaults.headers.common["Authorization"] = user
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    console.log(user.userName)
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md"
    >
      <Link to="/"><h1 className="text-2xl font-bold text-teal-400">DebugEase</h1></Link>
      <div className="flex items-center">
        {!user ? (
          <>
            <Link to="/login">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg mr-3 transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg transition">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
            <div className="flex items-center gap-3 relative group">
              <Link to="/editor">
              <button className="px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-lg transition">
                Editor
              </button>
            </Link>
            <button
              onClick = {handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          
            <div
              className="relative cursor-pointer group"
              onClick={() => navigate("/profile")}
            >
              <FaUserCircle size={30} className="text-white" />

              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {email}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;
