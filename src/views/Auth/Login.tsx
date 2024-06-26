import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Errors } from "../../..";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    try {
      const res = await fetch("https://api.realworld.io/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { email, password },
        }),
      });

      if (!res.ok) {
        const errorData: Errors = await res.json();
        const errorMessages = Object.values(errorData.errors).flat();
        setErrors(errorMessages);
      } else {
        const data = await res.json();
        const token = data.user.token;

        // Using the login function from AuthContext
        login(token);

        navigate('/')
      }
    } catch (error) {
      setErrors(["An error occurred during login"]);
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link to="/register">Need an account?</Link>
              </p>

              {errors.length > 0 && (
                <ul className="error-messages">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}

              <form onClick={handleSubmit}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
