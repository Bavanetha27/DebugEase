import React, { useContext,useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const req = await axios.post("https://debugease-2ovx.onrender.com/login", {
        email: formData.email,
        password: formData.password
      })
      dispatch({
        type: "LOGIN",
        payload: req.data.token,
      });
      localStorage.setItem("token", req.data.token);
      localStorage.setItem("email", req.data.email);
      var isLoginSuccessful = req.data.loginStatus;
      if (isLoginSuccessful) {
        alert(req.data.response);
        navigate("/");
      } else {
        alert(req.data.response);
      }
    }catch(err){
      console.log("Error occured");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg text-white max-w-sm w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-center mb-4">Welcome Back 🎉</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none" required />
          <input type="password" name="password" placeholder="Password" value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none" required />
          <button type="submit" className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 px-4 py-2 rounded-lg font-semibold">Login</button>
        </form>
        <p className="mt-4 text-center">
          New here? <Link to="/signup" className="text-fuchsia-400">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
