// src/components/AddTaskForm.jsx
// This component renders the form used to create a new task.
// It includes title, description, priority selector and an optional due date.

import { useState } from 'react'

const PRIORITIES = ['low', 'medium', 'high']

export default function AddTaskForm({ onAdd }) {
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [priority,    setPriority]    = useState('medium')
  const [dueDate,     setDueDate]     = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [open,        setOpen]        = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onAdd({ title, description, priority, due_date: dueDate || null })
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-wrapper">
      {!open ? (
        <button className="btn-add-trigger" onClick={() => setOpen(true)}>
          <span className="plus">+</span> NEW TASK
        </button>
      ) : (
        <form className="task-form" onSubmit={handleSubmit}>
          <h3 className="form-title">NEW TASK</h3>
          <input
            className="field"
            placeholder="Task title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea
            className="field"
            placeholder="Description (optional)"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="due-date-row">
            <label className="due-date-label">Due date (optional)</label>
            <input
              className="field"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div className="priority-row">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                className={`priority-chip priority-${p} ${priority === p ? 'active' : ''}`}
                onClick={() => setPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
