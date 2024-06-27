import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const [active, setActive] = useState<string>("/");
  const { isAuthenticated } = useAuth();

  // Handle the active link change
  const handleActiveNavBar = (path: string) => {
    setActive(path);
  };

  return (
    <header>
      {/* Unautheticated user */}
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right right-nav">
            <li className="nav-item">
              {/* Add "active" className when you're on that page" */}
              <Link
                className={`nav-link ${active === "/" ? "active" : ""}`}
                to="/"
                onClick={() => handleActiveNavBar("/")}
              >
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              // Aunthenticated user
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/editor">
                    {" "}
                    <i className="ion-compose"></i>&nbsp;New Article{" "}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/settings">
                    {" "}
                    <i className="ion-gear-a"></i>&nbsp;Settings{" "}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile/eric-simons">
                    <img src="" className="user-pic" />
                    Eric Simons
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Show this for users who haven't logged in their account */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      active === "/login" ? "active" : ""
                    }`}
                    to="/login"
                    onClick={() => handleActiveNavBar("/login")}
                  >
                    Sign in
                  </Link>
                </li>
                <li className="nav-item sign-up">
                  <Link
                    className={`nav-link ${
                      active === "/register" ? "active" : ""
                    }`}
                    to="/register"
                    onClick={() => handleActiveNavBar("/register")}
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
