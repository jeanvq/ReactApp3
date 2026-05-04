// src/api/tasks.js
// This file contains all the functions that communicate with Firebase Firestore.
// Think of it as the "API layer" — React components never talk to Firestore directly,
// they always go through these functions.

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// The name of our Firestore collection (like a table in MySQL)
const COL = 'tasks'

// Helper that returns a reference to the 'tasks' collection
const ref = () => collection(db, COL)

// Converts a Firestore document snapshot into a plain JavaScript object
const toTask = (snap) => ({
  id:          snap.id,
  title:       snap.data().title,
  description: snap.data().description ?? '',
  priority:    snap.data().priority    ?? 'medium',
  completed:   snap.data().completed   ?? false,
  due_date:    snap.data().due_date    ?? null, // deadline date — can be empty
  created_at:  snap.data().created_at?.toDate?.()?.toISOString() ?? new Date().toISOString(),
})

// GET — fetch all tasks from Firestore, ordered by newest first
export const getTasks = async () => {
  const q    = query(ref(), orderBy('created_at', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(toTask)
}

// POST — create a new task document in Firestore
export const createTask = async ({ title, description = '', priority = 'medium', due_date = null }) => {
  const docRef = await addDoc(ref(), {
    title,
    description,
    priority,
    due_date,                // store the due date string (or null if not set)
    completed:  false,
    created_at: serverTimestamp(),
  })

  return {
    id: docRef.id,
    title,
    description,
    priority,
    due_date,
    completed:  false,
    created_at: new Date().toISOString(),
  }
}

// PUT — update specific fields of an existing task
export const updateTask = async (id, fields) => {
  await updateDoc(doc(db, COL, id), fields)
  return { id, ...fields }
}

// DELETE — remove a task document from Firestore permanently
export const deleteTask = async (id) => {
  await deleteDoc(doc(db, COL, id))
  return { success: true, id }
}

// TOGGLE — flip the completed status of a task (true → false or false → true)
export const toggleTask = (task) =>
  updateTask(task.id, { completed: !task.completed })