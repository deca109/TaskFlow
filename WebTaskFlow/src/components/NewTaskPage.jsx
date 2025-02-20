import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const NewTaskPage = () => {
  const [task, setTask] = useState({
    Task_ID: "",
    Description: "",
    Required_Skills: [],
    Priority: "",
    Estimated_Time: "",
    Task_Complexity: "",
  });
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/get_skills").then((res) => {
      setSkills(res.data.map((skill) => ({ value: skill, label: skill })));
    });
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (selectedOptions) => {
    setTask({ ...task, Required_Skills: selectedOptions.map((opt) => opt.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...task,
        Required_Skills: task.Required_Skills.join(",") // Convert list to comma-separated string
      };
      await axios.post("http://localhost:5000/add_task", taskData);
      alert("Task added successfully!");
      navigate("/tasks");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Task_ID"
          placeholder="Task ID"
          value={task.Task_ID}
          onChange={handleChange}
          className="input"
          required
        />
        <textarea
          name="Description"
          placeholder="Description"
          value={task.Description}
          onChange={handleChange}
          className="textarea"
          required
        />
        <Select
          options={skills}
          isMulti
          placeholder="Select Required Skills"
          onChange={handleSkillsChange}
          className="select"
        />
        <input
          type="number"
          name="Priority"
          placeholder="Priority (1-5)"
          min="1"
          max="5"
          value={task.Priority}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="Estimated_Time"
          placeholder="Estimated Time (in hours)"
          value={task.Estimated_Time}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="Task_Complexity"
          placeholder="Task Complexity (1-10)"
          min="1"
          max="10"
          value={task.Task_Complexity}
          onChange={handleChange}
          className="input"
          required
        />
        <button
          type="submit"
          className="button"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default NewTaskPage;