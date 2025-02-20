import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import ProjectOverview from "./components/projectoverview";
import TasksPage from "./components/TasksPage";
import NewTaskPage from "./components/NewTaskPage";
import UsersPage from "./components/UsersPage";
import NewUserPage from "./components/NewUserPage";
import EditUserPage from "./components/EditUserPage";
import TaskAssignment from "./components/TaskAssignment";
import Banner from "./components/Banner";


export default function App() {
  const [projectName, setProjectName] = useState("");
  const [isProjectCreated, setIsProjectCreated] = useState(false);

  const handleCreateProject = () => {
    if (projectName.trim() !== "" || localStorage.getItem("projectName")) {
      setProjectName(projectName.trim() || localStorage.getItem("projectName"));
      localStorage.setItem("projectName", projectName.trim());
      setIsProjectCreated(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("projectName")) {
      setProjectName(localStorage.getItem("projectName"));
      setIsProjectCreated(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h1 className="app-title">TaskFlow.ai <span className="version">v0.1</span></h1>
          <nav>
            <ul>
              <li>
                <Link to="/" className={({ isActive }) => (isActive ? "active" : "")}>Project</Link>
              </li>
              <li>
                <Link to="/tasks" className={({ isActive }) => (isActive ? "active" : "")}>Tasks</Link>
              </li>
              <li>
                <Link to="/users" className={({ isActive }) => (isActive ? "active" : "")}>Users</Link>
              </li>
              <li>
                <Link to="/task-assignment" className={({ isActive }) => (isActive ? "active" : "")}>Task Assignment</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="app-main-content">
          {isProjectCreated ? (
            <>
              <Routes>
                <Route path="/" element={<ProjectOverview projectName={projectName} />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/new" element={<NewTaskPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/new" element={<NewUserPage />} />
                <Route path="/users/:id/edit" element={<EditUserPage />} />
                <Route path="/task-assignment" element={<TaskAssignment />} />
              </Routes>
              <Banner />
            </>
          ) : (
            <div>
              <h2>New Project</h2>
              <p>Start by creating a new project to which tasks and users can be added.</p>

              <label className="app-label">NAME</label>
              <input
                type="text"
                className="app-input"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <button className="app-button" onClick={handleCreateProject}>
                Create Project
              </button>

              <section className="instructions">
                <h3>Instructions</h3>
                <p>Start by creating a new project. Create <b>tasks</b> and <b>users</b>, setting constraints for each.</p>
                <p>When you are ready to find a <b>solution</b>, select <b>Solution Details</b> in the sidebar.</p>
                <p>It is possible to <b>lock tasks</b> that have been previously allocated.</p>
                <p>You can select and view <b>previous solutions</b> using the sidebar navigation.</p>
              </section>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}