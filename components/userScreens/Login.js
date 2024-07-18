import React, { useState } from "react";
import loginStyles from "./Login.module.css";
import Link from "next/link";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";
import { useGlobalContext } from "../../contextAPI/context";
import cookie from "cookie";
let newUser = "";
import { useRouter } from "next/router";
import { WP_URL } from "../../utils/config";

if (typeof window !== "undefined") {
  newUser = localStorage.getItem("new-user")
    ? JSON.parse(localStorage.getItem("new-user")).username
    : "";
}
function Login() {
  const router = useRouter();
  const [formFields, setFormFields] = useState({
    username: newUser,
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuthInContext, currentUser } = useGlobalContext();

  const handleInputChange = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // router.push("/dashboard");

    // ;\
    ;
    e.preventDefault();
    const finalData = {
      username: formFields.username,
      password: formFields.password,
    };
    setLoading(true);

    try {
      setError("");
      const endpoint = `${WP_URL}/wp-json/auth/v1/login`;
      const response = await axios.post(
        `${endpoint}?username=${finalData.username}&password=${finalData.password}`
      );
      const data = await response.data.data;
      setError("");
      setLoading(false);
      setFormFields({
        username: "",
        password: "",
      });

      const { user_pass, token, user_email, display_name, ID } = data;
      // save token to local storage

      localStorage.setItem("mrAuthToken", JSON.stringify(user_pass));
      localStorage.setItem("user", JSON.stringify(data));
      console.log("token", user_pass);
      // set auth-token in cookie with path with cookie library expire time 1 year
      document.cookie = cookie.serialize("mrAuthToken", user_pass, {
        path: "/",
        sameSite: "strict",
        maxAge: 31536000,
      });
      ;

      setAuthInContext(data);
      ;
      router.push("/dashboard");
    } catch (error) {
      let errorMessage = error;
      setError(errorMessage);
      setLoading(false);
      // console.log('error.response', error.response.data)
    }
  };

  return (
    <div className={loginStyles.login}>
      <h1>Login</h1>
      <Container className={loginStyles.loginContainer}>
        <div className={loginStyles.loginForm}>
          {currentUser && (
            <div className={loginStyles.loginNotice}>
              <p className="alert alert-success">
                You are logged in as{" "}
                <strong>{currentUser.user_display_name}</strong>, Click to go to
                the <Link href="/dashboard">dashboard</Link>
              </p>
            </div>
          )}
          <div className={loginStyles.loginNotice}>
            {error && (
              <p
                className={`alert alert-danger`}
                dangerouslySetInnerHTML={{ __html: error }}
              ></p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className={loginStyles.loginFormGroup}>
              {/* <label htmlFor='username'>Username</label> */}
              <input
                type="text"
                name="username"
                className={`${loginStyles.loginFormControl} mrInput`}
                id="username"
                placeholder="Username or Email *"
                required
                value={formFields.username}
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
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className={loginStyles.loginLinks}>
          <Link href="/forgot-password">
            <a>Forgot your password?</a>
          </Link>
          <Link href="/register">
            <a>Create a new Account</a>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Login;
