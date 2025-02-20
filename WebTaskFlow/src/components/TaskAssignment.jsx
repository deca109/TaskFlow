import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../App.css";

const TaskAssignment = () => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskID, setTaskID] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [recommendedEmployee, setRecommendedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskID, setEditTaskID] = useState(null);
  const [completedDate, setCompletedDate] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [feedbackScore, setFeedbackScore] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [isNewTask, setIsNewTask] = useState(false);
  const [taskHistoryId, setTaskHistoryId] = useState(null); // Add this state
  const navigate = useNavigate();

  const calculateCompletionTime = (assignedDate, completedDate) => {
    if (!assignedDate || !completedDate) return "";
    const assigned = new Date(assignedDate);
    const completed = new Date(completedDate);
    const diffTime = Math.abs(completed - assigned);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
  };

  const adjustDateByHours = (date, hours) => {
    const baseDate = new Date(date);
    return new Date(baseDate.getTime() + hours * 60 * 60 * 1000).toISOString().split('T')[0];
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      maxWidth: "300px",
      marginBottom: "3rem"
    }),
    menu: (provided) => ({
      ...provided,
      maxWidth: "300px"
    }),
    menuList: (provided) => ({
      ...provided,
      maxWidth: "300px"
    })
  };

  // Add this function after the customStyles object
  const isTaskAlreadyAssigned = (taskId) => {
    return taskHistory.some(task => task.Task_ID === taskId);
  };

  useEffect(() => {
    axios.get("http://localhost:5000/get_task_history")
      .then((res) => {
        setTaskHistory(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching task history:", error);
        setLoading(false);
      });

    axios.get("http://localhost:5000/get_employee")
      .then((res) => {
        setEmployees(res.data.map(emp => ({
          value: emp.Employee_ID,
          label: emp.Name
        })));
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  const handleRecommend = () => {
    if (!taskID) {
      alert("Please enter a Task ID first");
      return;
    }
  
    axios.get(`http://localhost:5000/recommend_employee/${taskID}`)
      .then((res) => {
        if (res.data.message) {
          // Handle the case where no recommendation is available
          alert(res.data.message);
          return;
        }
        
        const employeeId = res.data.Best_Employee.Employee_ID;
        // Find the employee details from the employees list
        const employee = employees.find(emp => emp.value === employeeId);
        
        if (employee) {
          const recommended = {
            value: employeeId,
            label: employee.label
          };
          setRecommendedEmployee(recommended);
          setSelectedEmployee(recommended);
        } else {
          alert("Employee details not found");
        }
      })
      .catch((error) => {
        console.error("Error recommending employee:", error);
        alert("Error recommending employee. Please check if the Task ID exists.");
      });
  };

  // Modify the handleAssign function
  const handleAssign = () => {
    if (isTaskAlreadyAssigned(taskID)) {
      alert("This task has already been assigned!");
      return;
    }

    const data = {
      Employee_ID: selectedEmployee?.value || recommendedEmployee?.value,
      Task_ID: taskID,
      Assigned_Date: new Date().toISOString().split("T")[0]
    };

    axios.post("http://localhost:5000/add_task_history", data)
      .then(() => {
        alert("Task assigned successfully!");
        setIsNewTask(false);
        setTaskHistory([...taskHistory, data]);
        setTaskID("");
        setSelectedEmployee(null);
        setRecommendedEmployee(null);
      })
      .catch((error) => {
        console.error("Error assigning task:", error);
        if (error.response && error.response.status === 409) {
          alert("This task has already been assigned!");
        } else {
          alert("Failed to assign task");
        }
      });
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setEditTaskID(task.Task_ID);
    setTaskHistoryId(task.id);  // Add this line to store the task history id
    setSelectedEmployee(employees.find(emp => emp.value === task.Employee_ID));
    setCompletedDate(task.Completed_Date || "");
    setAssignedDate(task.Assigned_Date);
    const hours = calculateCompletionTime(task.Assigned_Date, task.Completed_Date);
    setCompletionTime(hours);
    setFeedbackScore(task.Feedback_Score || "");
  };

  const handleUpdate = () => {
    if (!editTaskID || !selectedEmployee) return;

    const hours = calculateCompletionTime(assignedDate, completedDate);

    const data = {
      Employee_ID: selectedEmployee.value,
      Task_ID: editTaskID,
      Completed_Date: completedDate,
      Completion_Time: hours,
      Feedback_Score: feedbackScore
    };

    axios.put(`http://localhost:5000/update_task_history/${taskHistoryId}`, data) // Update the axios call to use the correct endpoint and include the task history id
      .then(() => {
        alert("Task updated successfully!");
        setIsEditing(false);
        setEditTaskID(null);
        axios.get("http://localhost:5000/get_task_history") // Refresh the task history after update
          .then((res) => {
            setTaskHistory(res.data);
          })
          .catch((error) => {
            console.error("Error fetching task history:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        alert("Failed to update task");
      });
  };

  const handleNewTaskAssignment = () => {
    setIsEditing(false);
    setIsNewTask(true);
    setTaskID("");
    setSelectedEmployee(null);
    setRecommendedEmployee(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="taskhistory-container">
      <h2 className="taskhistory-heading">Task Assignment</h2>

      {isEditing ? (
        <div>
          <h3>Edit Assigned Task</h3>
          <label className="taskhistory-label">Select Employee</label>
          <Select
            options={employees}
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            placeholder="Select Employee"
            styles={customStyles}
            isDisabled={true}
          />
          <label className="taskhistory-label">Completed Date</label>
          <input
            type="date"
            value={completedDate}
            onChange={(e) => {
              const newCompletedDate = e.target.value;
              setCompletedDate(newCompletedDate);
              const hours = calculateCompletionTime(assignedDate, newCompletedDate);
              setCompletionTime(hours);
            }}
            className="taskhistory-input"
          />
          <label className="taskhistory-label">Completion Time (Hours)</label>
          <div className="taskhistory-time-input">
            <input
              type="number"
              value={completionTime}
              onChange={(e) => {
                const newHours = parseInt(e.target.value) || 0;
                setCompletionTime(newHours);
                
                if (assignedDate) {
                  const newCompletedDate = adjustDateByHours(assignedDate, newHours);
                  setCompletedDate(newCompletedDate);
                }
              }}
              className="taskhistory-input"
              min="0"
              step="1"
            />
            <span className="taskhistory-time-unit">hours</span>
          </div>
          <label className="taskhistory-label">Feedback Score</label>
          <input
            type="number"
            value={feedbackScore}
            onChange={(e) => setFeedbackScore(e.target.value)}
            className="taskhistory-input"
          />
          <button className="taskhistory-button" onClick={handleUpdate}>
            Update Task
          </button>
        </div>
      ) : isNewTask || taskHistory.length === 0 ? (
        <div>
          <h3>{isNewTask ? "New Task Assignment" : "No tasks assigned yet."}</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleAssign(); }}>
            <label className="taskhistory-label">Task ID</label>
            <input
              type="text"
              name="taskID"
              value={taskID}
              onChange={(e) => setTaskID(e.target.value)}
              className="taskhistory-input"
              required
            />

            <label className="taskhistory-label">Select Employee</label>
            <Select
              options={employees}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              placeholder="Select Employee"
              className="taskhistory-select"
              styles={customStyles}
            />

            <button type="button" className="addtaskhistory-button" onClick={handleRecommend}>
              Recommend Employee
            </button>

            {recommendedEmployee && (
              <div className="taskhistory-recommendation">
                <p>Recommended Employee: {recommendedEmployee.label}</p>
              </div>
            )}

            <button type="submit" className="addtaskhistory-button" disabled={!selectedEmployee}>
              Assign Task
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="taskhistory-table-container">
            <table className="taskhistory-tasks-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Employee ID</th>
                  <th>Assigned Date</th>
                  <th>Completed Date</th>
                  <th>Completion Time (Hours)</th>
                  <th>Feedback Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {taskHistory.map((task) => (
                  <tr key={task.id}>
                    <td>{task.Task_ID}</td>
                    <td>{task.Employee_ID}</td>
                    <td>{task.Assigned_Date}</td>
                    <td>{task.Completed_Date}</td>
                    <td>{task.Completion_Time}</td>
                    <td>{task.Feedback_Score}</td>
                    <td>
                      <button className="taskhistory-button" onClick={() => handleEdit(task)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="addtaskhistory-button" onClick={handleNewTaskAssignment}>
            New Task Assignment
          </button>
        </>
      )}
    </div>
  );
};

export default TaskAssignment;