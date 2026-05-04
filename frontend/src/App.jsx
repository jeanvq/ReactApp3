// src/App.jsx
// This is the root component of the app.
// It uses the useTasks hook to get all task data and functions,
// then passes them down to the child components that need them.

import { useTasks } from './hooks/useTasks'
import AddTaskForm from './components/AddTaskForm'
import TaskList from './components/TaskList'
import './App.css'

export default function App() {
  // Get task data and CRUD functions from our custom hook
  const { tasks, loading, error, addTask, toggleTask, removeTask } = useTasks()

  // Count completed tasks to display progress in the header
  const done  = tasks.filter(t => t.completed).length
  const total = tasks.length

  return (
    <div className="app">

      {/* Decorative background grid — purely visual */}
      <div className="bg-grid" aria-hidden />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">

          {/* App logo / wordmark */}
          <div className="wordmark">
            <span className="wordmark-accent">◆</span>
            <span className="wordmark-text">TASKLOG</span>
          </div>

          {/* Progress bar — only shows when there is at least one task */}
          {total > 0 && (
            <div className="progress-wrap">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
              <span className="progress-label">{done}/{total} done</span>
            </div>
          )}

        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main">
        <div className="container">

          {/* Hero section — big title at the top */}
          <div className="hero">
            <h1 className="hero-title">YOUR<br/>TASKS.</h1>
            <p className="hero-sub">Track, complete, move forward.</p>
          </div>

          {/* Form to add a new task — onAdd is passed from useTasks */}
          <AddTaskForm onAdd={addTask} />

          {/* Show a spinner while tasks are loading from Firestore */}
          {loading && (
            <div className="state-msg">
              <span className="spinner" />
              Loading tasks…
            </div>
          )}

          {/* Show an error message if the Firestore request failed */}
          {error && (
            <div className="state-msg error">
              ⚠ {error}
            </div>
          )}

          {/* Show the task list only when we have data and no errors */}
          {!loading && !error && (
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={removeTask}
            />
          )}

        </div>
      </main>
    </div>
  )
}