import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../App.css";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);
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
  const [taskHistoryId, setTaskHistoryId] = useState(null);
  const [employeeWorkloads, setEmployeeWorkloads] = useState({});
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
    return new Date(baseDate.getTime() + hours * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      maxWidth: "300px",
      marginBottom: "3rem",
    }),
    menu: (provided) => ({
      ...provided,
      maxWidth: "300px",
    }),
    menuList: (provided) => ({
      ...provided,
      maxWidth: "300px",
    }),
  };

  const isTaskAlreadyAssigned = (taskId) => {
    return taskHistory.some((task) => task.Task_ID === taskId);
  };

  const calculateWorkloadPerWeek = (hours) => {
    return Math.ceil(hours / 7);
  };

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/get_task_history"),
      axios.get("http://localhost:5000/get_employee")
    ])
      .then(([taskRes, empRes]) => {
        setTaskHistory(taskRes.data);
        
        const workloads = {};
        empRes.data.forEach(emp => {
          workloads[emp.Employee_ID] = emp.Current_Workload || 0;
        });
        setEmployeeWorkloads(workloads);
        
        setEmployees(empRes.data.map(emp => ({
          value: emp.Employee_ID,
          label: emp.Name
        })));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleRecommend = () => {
    if (!taskID) {
      alert("Please enter a Task ID first");
      return;
    }

    axios
      .get(`http://localhost:5000/recommend_employee/${taskID}`)
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
          return;
        }

        const employeeId = res.data.Best_Employee.Employee_ID;
        const employee = employees.find((emp) => emp.value === employeeId);

        if (employee) {
          const recommended = {
            value: employeeId,
            label: employee.label,
          };
          setRecommendedEmployee(recommended);
          setSelectedEmployee(recommended);
        } else {
          alert("Employee details not found");
        }
      })
      .catch((error) => {
        console.error("Error recommending employee:", error);
        alert(
          "Error recommending employee. Please check if the Task ID exists."
        );
      });
  };

  const handleAssign = () => {
    if (!taskID) {
      alert("Please enter a Task ID");
      return;
    }

    if (isTaskAlreadyAssigned(taskID)) {
      alert("This Task ID is already assigned to another employee!");
      setTaskID("");
      return;
    }

    const selectedEmployeeId = selectedEmployee?.value || recommendedEmployee?.value;
    if (!selectedEmployeeId) {
      alert("Please select an employee");
      return;
    }

    axios.get(`http://localhost:5000/get_task/${taskID}`)
      .then((taskRes) => {
        if (!taskRes.data) {
          alert("Task ID does not exist!");
          return;
        }

        const taskDetails = taskRes.data;
        const estimatedHours = taskDetails.Estimated_Time || 0;
        const workloadIncrease = calculateWorkloadPerWeek(estimatedHours);
        
        const taskHistoryData = {
          Employee_ID: selectedEmployeeId,
          Task_ID: parseInt(taskID),
          Assigned_Date: new Date().toISOString().split("T")[0]
        };

        const workloadData = {
          Current_Workload: (employeeWorkloads[selectedEmployeeId] || 0) + workloadIncrease
        };

        Promise.all([
          axios.post("http://localhost:5000/add_task_history", taskHistoryData),
          axios.put(`http://localhost:5000/update_employee/${selectedEmployeeId}`, workloadData)
        ])
          .then(([taskRes, workloadRes]) => {
            setTaskHistory(prevHistory => [...prevHistory, taskHistoryData]);
            setEmployeeWorkloads(prev => ({
              ...prev,
              [selectedEmployeeId]: workloadData.Current_Workload
            }));
            alert("Task assigned successfully!");
            setIsNewTask(false);
            setTaskID("");
            setSelectedEmployee(null);
            setRecommendedEmployee(null);
          })
          .catch((error) => {
            console.error("Error updating task and workload:", error);
            if (error.response && error.response.status === 409) {
              alert("This Task ID is already assigned!");
              setTaskID("");
            } else {
              alert("Failed to assign task and update workload");
            }
          });
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        alert("Failed to fetch task details. Please check if the Task ID exists.");
        setTaskID("");
      });
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setEditTaskID(task.Task_ID);
    setTaskHistoryId(task.id);
    setSelectedEmployee(
      employees.find((emp) => emp.value === task.Employee_ID)
    );
    setCompletedDate(task.Completed_Date || "");
    setAssignedDate(task.Assigned_Date);
    const hours = calculateCompletionTime(
      task.Assigned_Date,
      task.Completed_Date
    );
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
      Feedback_Score: feedbackScore,
    };

    axios
      .put(`http://localhost:5000/update_task_history/${taskHistoryId}`, data)
      .then(() => {
        alert("Task updated successfully!");
        setIsEditing(false);
        setEditTaskID(null);
        axios
          .get("http://localhost:5000/get_task_history")
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
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
        Task Assignment
      </h2>
      {isEditing ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Assigned Task
          </h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employee
          </label>
          <Select
            options={employees}
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            placeholder="Select Employee"
            styles={customStyles}
            isDisabled={true}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
            Completed Date
          </label>
          <input
            type="date"
            value={completedDate}
            onChange={(e) => {
              const newCompletedDate = e.target.value;
              setCompletedDate(newCompletedDate);
              const hours = calculateCompletionTime(
                assignedDate,
                newCompletedDate
              );
              setCompletionTime(hours);
            }}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
            Completion Time (Hours)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={completionTime}
              onChange={(e) => {
                const newHours = parseInt(e.target.value) || 0;
                setCompletionTime(newHours);
                if (assignedDate) {
                  const newCompletedDate = adjustDateByHours(
                    assignedDate,
                    newHours
                  );
                  setCompletedDate(newCompletedDate);
                }
              }}
              className="w-24 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              min="0"
              step="1"
            />
            <span className="text-gray-600">hours</span>
          </div>
          <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
            Feedback Score
          </label>
          <input
            type="number"
            value={feedbackScore}
            onChange={(e) => setFeedbackScore(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500"
            onClick={handleUpdate}
          >
            Update Task
          </button>
        </div>
      ) : isNewTask || taskHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {isNewTask ? "New Task Assignment" : "No tasks assigned yet."}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAssign();
            }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-gray-700">
              Task ID
            </label>
            <input
              type="text"
              name="taskID"
              value={taskID}
              onChange={(e) => setTaskID(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <label className="block text-sm font-medium text-gray-700">
              Select Employee
            </label>
            <Select
              options={employees}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              placeholder="Select Employee"
              styles={customStyles}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-gray-500"
              onClick={handleRecommend}
            >
              Recommend Employee
            </button>
            {recommendedEmployee && (
              <p className="text-gray-700 text-center mt-2">
                Recommended Employee: {recommendedEmployee.label}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedEmployee}
            >
              Assign Task
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left">Task ID</th>
                  <th className="px-4 py-2 text-left">Employee ID</th>
                  <th className="px-4 py-2 text-left">Assigned Date</th>
                  <th className="px-4 py-2 text-left">Completed Date</th>
                  <th className="px-4 py-2 text-left">Completion Time</th>
                  <th className="px-4 py-2 text-left">Feedback Score</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taskHistory.map((task) => (
                  <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{task.Task_ID}</td>
                    <td className="px-4 py-2">{task.Employee_ID}</td>
                    <td className="px-4 py-2">{task.Assigned_Date}</td>
                    <td className="px-4 py-2">{task.Completed_Date || '-'}</td>
                    <td className="px-4 py-2">{task.Completion_Time || '-'}</td>
                    <td className="px-4 py-2">{task.Feedback_Score || '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500"
            onClick={handleNewTaskAssignment}
          >
            New Task Assignment
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskAssignment;
