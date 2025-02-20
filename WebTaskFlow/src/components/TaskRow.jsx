import React from "react";

const TaskRow = ({ task }) => {
  return (
    <tr>
      <td>{task.Task_ID}</td>
      <td>{task.Description}</td>
      <td>{task.Required_Skills.join(", ")}</td>
      <td>{task.Priority}</td>
      <td>{task.Estimated_Time}</td>
      <td>{task.Task_Complexity}</td>
    </tr>
  );
};

export default TaskRow;