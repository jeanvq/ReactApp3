// src/hooks/useTasks.js
// This is a custom React hook that manages all task-related state and logic.
// Components don't talk to the API directly — they use this hook instead.
// Think of it as the "brain" that connects the UI to the database functions.

import { useState, useEffect, useCallback } from 'react'
import * as api from '../api/tasks'

export function useTasks() {
  // The list of tasks fetched from Firestore
  const [tasks,   setTasks]   = useState([])

  // True while we are waiting for Firestore to respond
  const [loading, setLoading] = useState(true)

  // Holds an error message if something goes wrong, otherwise null
  const [error,   setError]   = useState(null)

  // Fetches all tasks from Firestore and updates state
  // useCallback prevents this function from being recreated on every render
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.getTasks()
console.log('Tasks from Firestore:', result)
setTasks(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Run load() automatically when the component first mounts
  useEffect(() => { load() }, [load])

  // Adds a new task to Firestore and prepends it to the local list
  const addTask = async (body) => {
    const task = await api.createTask(body)
    setTasks(prev => [task, ...prev])
  }

  // Toggles the completed status of a task
  // Uses optimistic update — updates the UI instantly, then syncs with Firestore
  // If Firestore fails, it reverts the UI back to the original state
  const toggleTask = async (task) => {
    // Update UI immediately without waiting for Firestore
    setTasks(prev => prev.map(t =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    ))
    try {
      await api.toggleTask(task)
    } catch (e) {
      // Revert back if the Firestore update failed
      setTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, completed: task.completed } : t
      ))
    }
  }

  // Deletes a task from Firestore and removes it from the local list
  const removeTask = async (id) => {
    await api.deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // Return everything the components need
  return { tasks, loading, error, addTask, toggleTask, removeTask, reload: load }
}