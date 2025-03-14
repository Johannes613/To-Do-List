import { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/home/Home";
import SignIn from "./components/signin/SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/config";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {currentUser ? (
        <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ) : (
        <SignIn currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
