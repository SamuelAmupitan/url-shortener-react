import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { auth, googleProvider } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import Line from "/images/Vector 8.svg";
import GoogleIcon from "/images/logo_googleg_48dp.png";
import AppleLogo from "/images/Path.svg";
import Footer from "../../components/Footer";
import "./Login.css";
import { useEffect, useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [login, setLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const logIn = async () => {
    setIsLoading(true); // Set loading state to true when logging in
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      setLogin("Login Successful!");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.code);
    } finally {
      setIsLoading(false); // Set loading state to false after login attempt
    }
  };

  const logInGoogle = async () => {
    setIsLoading(true); // Set loading state to true when logging in with Google
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading state to false after login attempt
    }
  };

  const passwordCheck = (newPassword: string) => {
    const value = newPassword;
    setPassword(value);
    console.log(value, "Checking password");
  };

  return (
    <section className="login-container ">
      <div className="form-div">
        <p className="signup">Log in with</p>
        <div className="buttons-container">
          <button className="google" onClick={logInGoogle}>
            <span>
              <img
                src={GoogleIcon}
                alt="Google Icon"
                width="20px"
                height="20px"
              />
            </span>
            Google
          </button>
          <button className="apple">
            <span>
              <img
                src={AppleLogo}
                alt="Google Icon"
                width="17px"
                height="17px"
              />
            </span>
            Apple
          </button>
        </div>
        <p className="lin-container">
          <span>
            <img src={Line} alt="Line" className="w-[20em]" />
          </span>
          <span>Or</span>
          <span>
            <img src={Line} alt="Line" className="w-[20em]" />
          </span>
        </p>
        <form
          className="flex flex-col gap-[1.6em] w-[90%]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="container flex flex-col gap-[1em]">
            {/* Email or Username */}
            <div>
              <input
                type="text"
                placeholder="Email address or username"
                required
                pattern="^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$) | ([a-zA-Z]+$)"
                className="input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb">
              <PasswordInput onChange={passwordCheck} placeholder="Password" />
            </div>

            <div className="forgot">
              <Link to="/forgotpassword" className="forgot">
                Forgot your password?
              </Link>
            </div>

            {login && (
              <p className="text-green-500 text-base mt-1 font-medium">
                {login}
              </p>
            )}
            <div>
              <button onClick={logIn} className="login-btn">
                {isLoading ? "Logging in..." : "Login"} {/* Display loading state */}
              </button>
            </div>

            <div>
              <p className="dont">
                Don't have an account?{" "}
                <Link to="/register" className="sign-up-text">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </form>

        <div>
          <p>
            <span className="by">By signing in with an account you agree to</span>
            <span className="privacy-policy">
              Scissors <strong>Terms of service</strong>,<strong>Privacy Policy</strong>{" "}
              and<strong>Acceptable Use Policy</strong>
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default LoginPage;
