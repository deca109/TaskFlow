import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

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

  const inputStyles =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add a new user to your project team.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="EMPLOYEE ID">
              <input
                type="text"
                name="Employee_ID"
                placeholder="Enter employee ID"
                value={user.Employee_ID}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>

            <FormField label="NAME">
              <input
                type="text"
                name="Name"
                placeholder="Enter full name"
                value={user.Name}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="ROLE">
              <input
                type="text"
                name="Role"
                placeholder="Enter role"
                value={user.Role}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>

            <FormField label="SKILLS">
              <input
                type="text"
                name="Skills"
                placeholder="Enter skills (comma separated)"
                value={user.Skills}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="EXPERIENCE (YEARS)">
              <input
                type="number"
                name="Experience"
                placeholder="Years of experience"
                value={user.Experience}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>

            <FormField label="AVAILABILITY (HOURS)">
              <input
                type="number"
                name="Availability"
                placeholder="Available hours"
                value={user.Availability}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="CURRENT WORKLOAD (HOURS)">
              <input
                type="number"
                name="Current_Workload"
                placeholder="Current workload"
                value={user.Current_Workload}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>

            <FormField label="PERFORMANCE SCORE">
              <input
                type="number"
                name="Performance_Score"
                placeholder="Performance score"
                value={user.Performance_Score}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="px-4 py-2 mr-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUserPage;
