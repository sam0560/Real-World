import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right right-nav">
            <li>
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            {/* Show this for users who hasn't log in */}
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Sign in
              </Link>
            </li>
            <li className="nav-item sign-up">
              <Link className="nav-link" to="/register">
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
