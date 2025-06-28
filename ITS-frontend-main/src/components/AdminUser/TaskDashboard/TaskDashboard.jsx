import React, { useState, useEffect } from 'react';
import styles from './TaskDashboard.module.css';

const initialTaskState = {
  title: '',
  description: '',
  assignedTo: '',
  priority: 'Medium',
  status: 'Pending',
  assignedDate: '',
  dueDate: '',
};

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState(initialTaskState);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Fetch tasks from backend on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Error loading tasks:', err.message);
      }
    };
    fetchTasks();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Create task: send to backend and update UI
  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert('Please fill in required fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error('Failed to create task');

      const data = await res.json();
      const createdTask = { ...newTask, id: data.taskId || tasks.length + 1 };

      setTasks(prev => [...prev, createdTask]);
      setNewTask(initialTaskState);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert('Error saving task');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.heading}>Tasks</h2>
          <p className={styles.subheading}>Manage intern assignments and tasks</p>
        </div>
        <button className={styles.createButton} onClick={() => setShowModal(true)}>
          + Create New Task
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearchChange}
        />
        <button className={styles.filterIcon}>⚙️</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.assignedTo}</td>
                <td>{task.dueDate}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>No tasks found matching your search.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New Task</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className={styles.modalContent}>
              <label>Title</label>
              <input name="title" value={newTask.title} onChange={handleInputChange} />

              <label>Description</label>
              <textarea name="description" value={newTask.description} onChange={handleInputChange} />

              <div className={styles.row}>
                <div>
                  <label>Assign To</label>
                  <select name="assignedTo" value={newTask.assignedTo} onChange={handleInputChange}>
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.name}>{student.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Priority</label>
                  <select name="priority" value={newTask.priority} onChange={handleInputChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Status</label>
                  <select name="status" value={newTask.status} onChange={handleInputChange}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div>
                  <label>Assigned Date</label>
                  <input type="date" name="assignedDate" value={newTask.assignedDate} onChange={handleInputChange} />
                </div>
              </div>

              <label>Due Date</label>
              <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} />

              <div className={styles.modalFooter}>
                <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button onClick={handleCreateTask} className={styles.submitBtn}>Create Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
