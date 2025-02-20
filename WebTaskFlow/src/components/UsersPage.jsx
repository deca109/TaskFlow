import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/get_employee")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleRemove = (userId) => {
    axios.delete(`http://localhost:5000/delete_employee/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.Employee_ID !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="users-container">
      <h2 className="users-heading">Users</h2>
      <Link to="/users/new" className="users-button">Create New User</Link>
      {users.length === 0 ? (
        <p>No users added yet.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Availability</th>
              <th>Current Workload</th>
              <th>Performance Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.Employee_ID}>
                <td>{user.Employee_ID}</td>
                <td>{user.Name}</td>
                <td>{user.Role}</td>
                <td>{user.Skills}</td>
                <td>{user.Experience}</td>
                <td>{user.Availability}</td>
                <td>{user.Current_Workload}</td>
                <td>{user.Performance_Score}</td>
                <td>
                  <Link to={`/users/${user.Employee_ID}/edit`} className="users-button">Edit</Link>
                  <button onClick={() => handleRemove(user.Employee_ID)} className="users-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;