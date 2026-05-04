// src/components/TaskList.jsx
// This component renders the full list of tasks with filter tabs at the top.
// It receives all tasks from App.jsx and filters them locally based on the selected tab.
// It does NOT fetch data — that is handled by the useTasks hook in App.jsx.

import { useState } from 'react'
import TaskCard from './TaskCard'

// The three available filter options
const FILTERS = ['all', 'active', 'completed']

export default function TaskList({ tasks, onToggle, onDelete }) {
  // Tracks which filter tab is currently selected
  const [filter, setFilter] = useState('all')

  // Filter the tasks array based on the selected tab
  const visible = tasks.filter(t => {
    if (filter === 'active')    return !t.completed
    if (filter === 'completed') return  t.completed
    return true // 'all' shows everything
  })

  // Count tasks for each filter to display in the tab badges
  const counts = {
    all:       tasks.length,
    active:    tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t =>  t.completed).length,
  }

  return (
    <div className="task-list-section">

      {/* Filter tabs — clicking a tab updates the filter state */}
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
            {/* Badge showing the count for this filter */}
            <span className="tab-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Show empty state if no tasks match the current filter */}
      {visible.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">◎</span>
          <p>No {filter === 'all' ? '' : filter} tasks</p>
        </div>
      ) : (
        /* Render a TaskCard for each visible task */
        <div className="task-cards">
          {visible.filter(t => t && t.id).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}