import React, { useState } from 'react';
import classes from './Login.module.css';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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

          <button type="submit" className={classes.submitBtn}>
            Sign In
          </button>
        </form>

        <p className={classes.footerText}>
          Don't have an account? <Link to={'/signup'}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;