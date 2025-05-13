import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (event) =>{
    event.preventDefault();
      try{
        const req = await axios.post("http://localhost:3000/signup",{
          userName:formData.name,
          email:formData.email,
          password:formData.password
        })
        //console.log(req)
        alert(req.data.response);
        if(req.data.signupStatus){
          navigate("/login");
        }
        else{
          navigate("/signup")
        }
      }
        catch(err){
          console.log(err);
        }
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-lg text-white max-w-sm w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-center mb-4">Create an Account 🚀</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none" required />
          <input type="email" name="email" placeholder="Email" value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none" required />
          <input type="password" name="password" placeholder="Password" value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none" required />
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg font-semibold">Sign Up</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-teal-400">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
