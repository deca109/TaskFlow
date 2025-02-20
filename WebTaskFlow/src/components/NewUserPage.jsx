import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const NewUserPage = () => {
  const [user, setUser] = useState({
    Employee_ID: "",
    Name: "",
    Role: "",
    Skills: "",
    Experience: "",
    Availability: "",
    Current_Workload: "",
    Performance_Score: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/add_employee", user);
      alert("User added successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-heading">Create New User</h2>
      <form onSubmit={handleSubmit} className="users-form">
        <input
          type="text"
          name="Employee_ID"
          placeholder="Employee ID"
          value={user.Employee_ID}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={user.Name}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="text"
          name="Role"
          placeholder="Role"
          value={user.Role}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="text"
          name="Skills"
          placeholder="Skills (comma separated)"
          value={user.Skills}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="number"
          name="Experience"
          placeholder="Experience (years)"
          value={user.Experience}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="number"
          name="Availability"
          placeholder="Availability (hours)"
          value={user.Availability}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="number"
          name="Current_Workload"
          placeholder="Current Workload (hours)"
          value={user.Current_Workload}
          onChange={handleChange}
          className="users-input"
          required
        />
        <input
          type="number"
          name="Performance_Score"
          placeholder="Performance Score"
          value={user.Performance_Score}
          onChange={handleChange}
          className="users-input"
          required
        />
        <button type="submit" className="users-button">Create User</button>
      </form>
    </div>
  );
};

export default NewUserPage;