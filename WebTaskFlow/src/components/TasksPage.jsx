import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/get_task")
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="heading">Tasks</h2>
      <Link to="/tasks/new" className="button">Create New Task</Link>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Description</th>
              <th>Required Skills</th>
              <th>Priority</th>
              <th>Estimated Time</th>
              <th>Task Complexity</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.Task_ID}>
                <td>{task.Task_ID}</td>
                <td>{task.Description}</td>
                <td>{task.Required_Skills.split(",").join(", ")}</td> 
                <td>{task.Priority}</td>
                <td>{task.Estimated_Time}</td>
                <td>{task.Task_Complexity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TasksPage;