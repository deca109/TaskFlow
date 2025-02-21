import { useState, useEffect } from "react";
import axios from "axios";

const StatCard = ({ label, value, bgColor = "bg-white" }) => (
  <div
    className={`${bgColor} rounded-xl shadow-sm p-6 transition-transform hover:scale-105`}
  >
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function ProjectOverview({ projectName }) {
  const [tasksCount, setTasksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [tasksAssignedCount, setTasksAssignedCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_task")
      .then((res) => {
        setTasksCount(res.data.length);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });

    axios
      .get("http://localhost:5000/get_employee")
      .then((res) => {
        setUsersCount(res.data.length);
        const uniqueRoles = new Set(res.data.map((emp) => emp.Role));
        setRolesCount(uniqueRoles.size);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    axios
      .get("http://localhost:5000/get_task_history")
      .then((res) => {
        setTasksAssignedCount(res.data.length);
      })
      .catch((error) => {
        console.error("Error fetching task history:", error);
      });
  }, []);

  const deleteProject = () => {
    if (window.confirm("Are you sure you want to delete this project? This will clear all data.")) {
      // Clear all data from different tables
      Promise.all([
        axios.delete("http://localhost:5000/clear_task_history"),
        axios.delete("http://localhost:5000/clear_tasks"),
        axios.delete("http://localhost:5000/clear_employees"),
      ])
        .then(() => {
          localStorage.removeItem("projectName");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error clearing project data:", error);
          alert("Failed to clear project data completely");
        });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{projectName}</h1>
        <p className="text-gray-600">
          An overview of the details of your project are displayed below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="TASKS"
          value={tasksCount}
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <StatCard
          label="USERS"
          value={usersCount}
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <StatCard
          label="ROLES"
          value={rolesCount}
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
        />
        <StatCard
          label="TASKS ASSIGNED"
          value={tasksAssignedCount}
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={deleteProject}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}
