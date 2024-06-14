import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <a href="/" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from{" "}
            <Link to="/https://thinkster.io">Thinkster</Link>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}
