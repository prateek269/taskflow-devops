import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks from Flask + PostgreSQL
  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error loading tasks:", error);
      });
  }, []);

  // Add task
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask,
        }),
      });

      const task = await response.json();

      setTasks((currentTasks) => [...currentTasks, task]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const todoCount = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const progressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const doneCount = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  return (
    <div className="app">

      <header className="header">
        <h1>TaskFlow</h1>
        <p>Team Task Management Dashboard</p>
      </header>

      <section className="add-task">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
            }
          }}
        />

        <button onClick={addTask}>
          Add Task
        </button>
      </section>

      <section className="stats">

        <div className="stat-card">
          <h2>{tasks.length}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h2>{todoCount}</h2>
          <p>Todo</p>
        </div>

        <div className="stat-card">
          <h2>{progressCount}</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-card">
          <h2>{doneCount}</h2>
          <p>Completed</p>
        </div>

      </section>

      <main className="tasks-section">

        <h2>Tasks</h2>

        <div className="task-list">

          {tasks.map((task) => (
            <div className="task-card" key={task.id}>

              <div className="task-info">

                <h3>{task.title}</h3>

                <span
                  className={`status ${task.status.replace(
                    " ",
                    "-"
                  )}`}
                >
                  {task.status}
                </span>

              </div>

              <div className="task-actions">

                <select
                  value={task.status}
                  onChange={(event) =>
                    updateStatus(
                      task.id,
                      event.target.value
                    )
                  }
                >
                  <option value="Todo">
                    Todo
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Done">
                    Done
                  </option>
                </select>

                <button
                  className="delete"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default App;