import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [active, setActive] = useState<string>("/");

  // Handle the active link change
  const handleActiveNavBar = (path: string) => {
    setActive(path);
  };

  return (
    <header>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right right-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${active === "/" ? "active" : ""}`}
                to="/"
                onClick={() => handleActiveNavBar("/")}
              >
                Home
              </Link>
            </li>
            {/* Show this for users who haven't logged in */}
            <li className="nav-item">
              <Link
                className={`nav-link ${active === "/login" ? "active" : ""}`}
                to="/login"
                onClick={() => handleActiveNavBar("/login")}
              >
                Sign in
              </Link>
            </li>
            <li className="nav-item sign-up">
              <Link
                className={`nav-link ${active === "/register" ? "active" : ""}`}
                to="/register"
                onClick={() => handleActiveNavBar("/register")}
              >
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}