import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    await api.post("users/", {
      email,
      password,
      role: "user"
    });

    navigate("/");
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={submit}>
        <input
          required
          placeholder="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}
