import React, { useState } from 'react';
import classes from './Signup.module.css';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineBadgeCheck } from "react-icons/hi";
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const naviagte = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up with:", formData);
  };

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.signupCard}>
        <div className={classes.header}>
          <h1 className={classes.title}>Zenith<span>Board</span></h1>
          <p className={classes.subtitle}>Start your creative journey today.</p>
        </div>

        <button className={classes.socialBtn}>
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <div className={classes.divider}>
          <span>or create an account</span>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.inputRow}>
            <div className={classes.inputGroup}>
              <HiOutlineBadgeCheck className={classes.inputIcon} />
              <input 
                name="name"
                type="text" 
                placeholder="Full Name" 
                onChange={handleChange}
                required 
              />
            </div>
            <div className={classes.inputGroup}>
              <HiOutlineUser className={classes.inputIcon} />
              <input 
                name="username"
                type="text" 
                placeholder="Username" 
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className={classes.inputGroup}>
            <HiOutlineMail className={classes.inputIcon} />
            <input 
              name="email"
              type="email" 
              placeholder="Email address" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className={classes.inputGroup}>
            <HiOutlineLockClosed className={classes.inputIcon} />
            <input 
              name="password"
              type="password" 
              placeholder="Create Password" 
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className={classes.submitBtn}>
            Create Account
          </button>
        </form>

        <p className={classes.footerText}>
          Already have an account? <Link to={'/login'}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;