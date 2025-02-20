import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";


export default function ProjectOverview({ projectName }) {
  const [tasksCount, setTasksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [tasksAssignedCount, setTasksAssignedCount] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/get_task")
      .then((res) => {
        setTasksCount(res.data.length);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });

    axios.get("http://localhost:5000/get_employee")
      .then((res) => {
        setUsersCount(res.data.length);
        const uniqueRoles = new Set(res.data.map(emp => emp.Role));
        setRolesCount(uniqueRoles.size);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    axios.get("http://localhost:5000/get_task_history")
      .then((res) => {
        setTasksAssignedCount(res.data.length);
      })
      .catch((error) => {
        console.error("Error fetching task history:", error);
      });
  }, []);

  const deleteProject = () => {
    localStorage.removeItem("projectName");
    window.location.reload();
  }

  return (
    <div className="overview-container">
      <h1>{projectName}</h1>
      <p>An overview of the details of your project are displayed below.</p>

      <div className="stats">
        <div className="stat-box">
          <span className="stat-label">TASKS</span>
          <span className="stat-value">{tasksCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">USERS</span>
          <span className="stat-value">{usersCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">ROLES</span>
          <span className="stat-value">{rolesCount}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">TASKS ASSIGNED</span>
          <span className="stat-value">{tasksAssignedCount}</span>
        </div>
      </div>

      <button className="delete-button" onClick={deleteProject}>Delete Project</button>

    </div>
  );
}
