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
    axios
      .get(`http://localhost:5000/get_employee/${id}`)
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
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md">
      {" "}
      {/* Main container styling */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Edit User</h2>{" "}
      {/* Heading styling */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {" "}
        {/* Form styling */}
        <input
          type="text"
          name="Employee_ID"
          placeholder="Employee ID"
          value={user.Employee_ID}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" // Input styling
          required
          disabled
        />
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={user.Name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <input
          type="text"
          name="Role"
          placeholder="Role"
          value={user.Role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <input
          type="text"
          name="Skills"
          placeholder="Skills (comma separated)"
          value={user.Skills}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <input
          type="number"
          name="Experience"
          placeholder="Experience (years)"
          value={user.Experience}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <input
          type="number"
          name="Availability"
          placeholder="Availability (hours)"
          value={user.Availability}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <input
          type="number"
          name="Current_Workload"
          placeholder="Current Workload (hours)"
          value={user.Current_Workload}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <input
          type="number"
          name="Performance_Score"
          placeholder="Performance Score"
          value={user.Performance_Score}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Input styling
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
        >
          {" "}
          {/* Button styling */}
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;
