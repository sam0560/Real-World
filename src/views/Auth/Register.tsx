import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../..";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] =  useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    const user:User = {username, email, password};

    try {
      const res = await fetch("https://api.realworld.io/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user}),
    });

    // Error message if !res.ok
    if (!res.ok){
      const errorData = await res.json()
      setErrors(errorData.errors ? Object.values(errorData.errors).flat() : ["An error occurred"]);
    }else {
      // Redirect to a protected route
      navigate("/login");
    }
    } catch (error) {
      setErrors(["An error occurred during registration"]);
    }
  }

  return (
    <>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              {errors.length > 0 && (
              <ul className="error-messages">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

              <form onSubmit={handleSubmit}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
