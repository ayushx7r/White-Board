import React, { useState } from 'react';
import classes from './Signup.module.css';
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineBadgeCheck
} from "react-icons/hi";
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // remove error while typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = "https://zenithboard-api.onrender.com/api/user/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        throw Error(data.message);
      }

      setFormData({
        name: '',
        username: '',
        email: '',
        password: ''
      });

      navigate('/login');

    } catch (err) {
      setError(err.message);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.signupCard}>

        <div className={classes.header}>
          <h1 className={classes.title}>
            Zenith<span>Board</span>
          </h1>

          <p className={classes.subtitle}>
            Start your creative journey today.
          </p>
        </div>

        <button className={classes.socialBtn}>
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <div className={classes.divider}>
          <span>or create an account</span>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>

          {/* NAME + USERNAME */}
          <div className={classes.inputRow}>

            <div className={classes.field}>
              <div className={classes.inputGroup}>
                <HiOutlineBadgeCheck className={classes.inputIcon} />

                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={classes.field}>
              <div className={classes.inputGroup}>
                <HiOutlineUser className={classes.inputIcon} />

                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div
                className={`${classes.errorWrapper} ${
                  error === "user" ? classes.showError : ""
                }`}
              >
                <span className={classes.inlineError}>
                  username already exists
                </span>
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div className={classes.field}>
            <div className={classes.inputGroup}>
              <HiOutlineMail className={classes.inputIcon} />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className={`${classes.errorWrapper} ${
                error === "email" ? classes.showError : ""
              }`}
            >
              <span className={classes.inlineError}>
                email already exists
              </span>
            </div>
          </div>

          {/* PASSWORD */}
          <div className={classes.field}>
            <div className={classes.inputGroup}>
              <HiOutlineLockClosed className={classes.inputIcon} />

              <input
                name="password"
                type="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className={`${classes.errorWrapper} ${
                error === "input" ? classes.showError : ""
              }`}
            >
              <span className={classes.inlineError}>
                Enter all fields
              </span>
            </div>
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