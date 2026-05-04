// src/components/TaskCard.jsx
// This component renders a single task as a card.
// It shows the due date with color coding:
// — red if the due date has already passed (overdue)
// — yellow if the due date is today
// — normal if there is still time left

import { useState } from 'react'

// Helper function that checks the status of the due date
// Returns 'overdue', 'today', or 'upcoming'
const getDueDateStatus = (dueDateStr) => {
  if (!dueDateStr) return null
  const due   = new Date(dueDateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (due < today) return 'overdue'
  if (due.getTime() === today.getTime()) return 'today'
  return 'upcoming'
}

export default function TaskCard({ task, onToggle, onDelete }) {
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Guard — if task is undefined for any reason, render nothing
  if (!task) return null

  const handleToggle = async () => {
    setToggling(true)
    try { await onToggle(task) } finally { setToggling(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await onDelete(task.id) } catch { setDeleting(false) }
  }

  // Format the creation date
  const createdDate = new Date(task.created_at).toLocaleDateString('en-CA', {
    month: 'short',
    day:   'numeric',
  })

  // Format the due date for display (e.g. "May 10")
  const formattedDueDate = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-CA', {
        month: 'short',
        day:   'numeric',
      })
    : null

  // Get the status so we can apply the right color
  const dueDateStatus = getDueDateStatus(task.due_date)

  return (
    <div
      className={`
        task-card
        priority-border-${task.priority}
        ${task.completed ? 'completed' : ''}
        ${deleting       ? 'deleting'  : ''}
      `}
    >
      {/* Check button to toggle completed status */}
      <div className="task-left">
        <button
          className={`check-btn ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={toggling}
          aria-label="Toggle complete"
        >
          {task.completed && (
            <svg viewBox="0 0 12 10" fill="none">
              <polyline
                points="1,5 4.5,9 11,1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Task content */}
      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          {/* Priority badge */}
          <span className={`badge priority-${task.priority}`}>{task.priority}</span>

          {/* Creation date */}
          <span className="task-date">Created {createdDate}</span>

          {/* Due date — only shown if a due date was set */}
          {formattedDueDate && (
            <span className={`due-date due-${dueDateStatus}`}>
              {dueDateStatus === 'overdue'  && '⚠ Overdue · '}
              {dueDateStatus === 'today'    && '⏰ Due today · '}
              {dueDateStatus === 'upcoming' && '📅 Due '}
              {formattedDueDate}
            </span>
          )}
        </div>
      </div>

      {/* Delete button — visible on hover */}
      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete task"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  )
}