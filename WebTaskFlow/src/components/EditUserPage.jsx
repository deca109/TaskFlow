import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";

const EditUserPage = () => {
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
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/get_employee/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/update_employee/${id}`, user);
      alert("User updated successfully!");
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-heading">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Employee_ID"
          placeholder="Employee ID"
          value={user.Employee_ID}
          onChange={handleChange}
          className="users-input"
          required
          disabled
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
        <button type="submit" className="users-button">Update User</button>
      </form>
    </div>
  );
};

export default EditUserPage;