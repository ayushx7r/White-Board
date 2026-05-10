import React, { useState } from 'react';
import classes from './Login.module.css';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  const navigate = useNavigate();

  const url = 'https://zenithboard-api.onrender.com/api/user/login'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(url, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        }, 
        credentials : 'include',
        body : JSON.stringify({email, password})
      })
      const data = await res.json();
      if(!res.ok) throw Error(data.message);
      navigate('/')
      setEmail("");
      setPassword("");
    } catch(err) {
      navigate('/login');
      setError(err.message);
    }
  };

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.loginCard}>
        <div className={classes.header}>
          <h1 className={classes.title}>Zenith<span>Board</span></h1>
          <p className={classes.subtitle}>Welcome back, creator.</p>
        </div>

        <button className={classes.socialBtn}>
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <div className={classes.divider}>
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.inputWrapper}>
            <div className={classes.inputGroup}>
              <HiOutlineMail className={classes.inputIcon} />
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            {error === "user" && <span className={classes.inlineError}>User not found</span>}
          </div>
          <div className={classes.inputWrapper}>
            <div className={classes.inputGroup}>
              <HiOutlineLockClosed className={classes.inputIcon} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {error === "password" && <span className={classes.inlineError}>Incorrect Password</span>}
            
          </div>
          <button type="submit" className={classes.submitBtn}>
            Sign In
          </button>
        </form>

        <p className={classes.footerText}>
          Don't have an account? <Link to={'/signup'}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;