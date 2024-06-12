export default function NavBar() {
  return (
    <header>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right right-nav">
            <li>
              <a className="nav-link active" href="/#">
                Home
              </a>
            </li>
            {/* Show this for users who hasn't log in */}
            <li className="nav-item">
              <a className="nav-link" href="/#/login">
                Sign in
              </a>
            </li>
            <li className="nav-item sign-up">
              <a className="nav-link" href="/#/register">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
