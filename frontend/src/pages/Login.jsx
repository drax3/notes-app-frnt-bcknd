import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const success = await loginUser(email, password);

    if (success) navigate("/users");
    else alert("Invalid credentials");
  };

  return (
    <div>
      <h2>Login</h2>
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
        <button>Login</button>
      </form>

      <a href="/signup">Create account</a>
    </div>
  );
}
