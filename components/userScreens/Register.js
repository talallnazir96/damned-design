import React, { useState } from "react";
import loginStyles from "./Login.module.css";
import Link from "next/link";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";

function Register() {
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // ;
    e.preventDefault();
    const dataToSend = {
      email: formFields.email,
      password: formFields.password,
    };
    setLoading(true);
    try {
      // ;
      setError("");
      setSuccess("");
      const response = await axios.post(`/api/register`, dataToSend);
      const { data, message } = await response.data;
      // console.log('Data', data)
      setError("");
      setSuccess(message);
      setLoading(false);
      setFormFields({
        email: "",
        password: "",
      });
      localStorage.setItem("new-user", JSON.stringify(data));
      // ;
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      // ;
    } catch (error) {
      let errorMessage = error.response.data.message;
      setError(errorMessage);
      setSuccess("");
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.login}>
      <h1>Register</h1>
      <Container className={loginStyles.loginContainer}>
        <div className={loginStyles.loginForm}>
          {/* <div className={loginStyles.loginNotice}></div> */}
          <div className={loginStyles.loginNotice}>
            {error && (
              <p
                className={`alert alert-danger`}
                dangerouslySetInnerHTML={{ __html: error }}
              ></p>
            )}
          </div>
          <div className={loginStyles.loginNotice}>
            {success && (
              <p
                className={`alert alert-success`}
                dangerouslySetInnerHTML={{ __html: success }}
              ></p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className={loginStyles.loginFormGroup}>
              {/* <label htmlFor='username'>Username</label> */}
              <input
                type="email"
                name="email"
                className={`${loginStyles.loginFormControl} mrInput`}
                id="email"
                placeholder="Email *"
                required
                value={formFields.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={loginStyles.loginFormGroup}>
              {/* <label htmlFor='password'>Password</label> */}
              <input
                type="password"
                name="password"
                className={`${loginStyles.loginFormControl} mrInput`}
                id="password"
                placeholder="Password *"
                required
                value={formFields.password}
                onChange={handleInputChange}
              />
            </div>
            <p className={loginStyles.textLeft}>
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our{" "}
              <Link href="/privacy-policy">privacy policy</Link> .
            </p>
            <div className={loginStyles.loginFormGroup}>
              <button
                type="submit"
                className={`${loginStyles.loginFormControl} mrInput ${loginStyles.btnSubmit}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className={loginStyles.loginLinks}>
          <p>
            You already have an account ?{" "}
            <Link href="/login">
              <a>Back to login page</a>
            </Link>
          </p>

          {/* <Link href='/forgot-password'>
                        <a>Forgot Password</a>
                    </Link> */}
        </div>
      </Container>
    </div>
  );
}

export default Register;
