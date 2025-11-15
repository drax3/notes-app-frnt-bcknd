import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Users() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("users/", {
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
      },
    })
    .then(res => setUsers(res.data))
    .catch(err => {
      if (err.response?.status === 401) {
        logoutUser();
      }
    });
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      <button onClick={logoutUser}>Logout</button>

      <ul>
        {users.map(u => (
          <li key={u.id}>{u.email} — {u.role}</li>
        ))}
      </ul>
    </div>
  );
}
