import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

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
    setTask({
      ...task,
      Required_Skills: selectedOptions.map((opt) => opt.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...task,
        Required_Skills: task.Required_Skills.join(","),
      };
      await axios.post("http://localhost:5000/add_task", taskData);
      alert("Task added successfully!");
      navigate("/tasks");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    }
  };

  const inputStyles =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details below to create a new task.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="TASK ID">
            <input
              type="text"
              name="Task_ID"
              placeholder="Enter task ID"
              value={task.Task_ID}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </FormField>

          <FormField label="DESCRIPTION">
            <textarea
              name="Description"
              placeholder="Enter task description"
              value={task.Description}
              onChange={handleChange}
              className={`${inputStyles} h-32 resize-none`}
              required
            />
          </FormField>

          <FormField label="REQUIRED SKILLS">
            <Select
              options={skills}
              isMulti
              placeholder="Select required skills"
              onChange={handleSkillsChange}
              className="react-select"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#D1D5DB",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                  },
                }),
              }}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="PRIORITY">
              <input
                type="number"
                name="Priority"
                placeholder="1-5"
                min="1"
                max="5"
                value={task.Priority}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>

            <FormField label="ESTIMATED TIME (HOURS)">
              <input
                type="number"
                name="Estimated_Time"
                placeholder="Hours"
                value={task.Estimated_Time}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>

            <FormField label="TASK COMPLEXITY">
              <input
                type="number"
                name="Task_Complexity"
                placeholder="1-10"
                min="1"
                max="10"
                value={task.Task_Complexity}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="px-4 py-2 mr-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskPage;
