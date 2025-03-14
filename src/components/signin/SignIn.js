import React, { useRef, useState } from "react";
import "./SignIn.css";
import google from "../../images/google.png";
import { toast, ToastContainer } from "react-toastify";
import { auth } from "../../config/config";
import { db } from "../../config/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";

export default function SignIn({currentUser, setCurrentUser}) {
  const [accState, setAccState] = useState("Sign-in");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleGoogle = async () => {
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formDatas = new FormData(formRef.current);
    const { email, password } = Object.fromEntries(formDatas.entries());
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "userTasks", user.uid), {
        tasks: [],
      });
      toast.success("Account created successfully");
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formDatas = new FormData(formRef.current);
    const { email, password } = Object.fromEntries(formDatas.entries());
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        toast.success("User Logged in!");
        
    } catch (error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
        
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      
      <div className="login-cont">
      <ToastContainer position="top-right" id= "toast-cont"/>

        <h2 className="login-head">{accState} To-Do-List App</h2>

        {accState === "Sign-in" && (
          <button
            className="google-auth"
            onClick={handleGoogle}
            disabled={loading}
          >
            <img src={google} alt="" /> {accState} with Google
          </button>
        )}

        <form ref={formRef}>
          {accState === "Sign-up" && (
            <div className="info-input">
              <input
                type="text"
                placeholder="Username"
                autoComplete="on"
                name="username"
                required
              />
            </div>
          )}

          <div className="info-input">
            <input
              type="email"
              aria-autocomplete="on"
              placeholder="Email"
              name="email"
              autoComplete="on"
              required
            />
          </div>

          <div className="info-input">
            <input
              type="password"
              placeholder="Password"
              autoComplete="on"
              name="password"
              required
            />
          </div>

          <button
            onClick={accState === "Sign-up" ? handleSignUp : handleLogIn}
            className="sub-btn"
            disabled={loading}
          >
            {loading
              ? "Loading"
              : accState === "Sign-up"
              ? "Create Account"
              : "Sign in"}
          </button>

          {accState === "Sign-up" ? (
            <div className="check-out">
              <p>
                Already have an account?{" "}
                <span onClick={() => setAccState("Sign-in")}>Sign In</span>
              </p>
            </div>
          ) : (
            <div className="check-out">
              <p>
                Don't have an account?{" "}
                <span onClick={() => setAccState("Sign-up")}>Sign Up</span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
