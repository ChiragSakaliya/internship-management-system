const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const knex = require('./dbConnect');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ------------------- Students -------------------

app.post('/students', async (req, res) => {
  const { name, mobile, address, email, internshipDomain, college, password } = req.body;
  if (!name || !mobile || !address || !email || !internshipDomain || !college || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await knex('students').insert({
      id: uuid.v4(),
      name,
      mobile,
      address,
      email,
      internshipDomain,
      college,
      password,
      isActive: 0
    });
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error('Error inserting student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await knex('students').select();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await knex('students').where({ id }).first();
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await knex('students').where({ id }).del();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.put('/students/:id/toggle-active', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await knex('students').where({ id }).first();
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const newStatus = student.isActive === 0 ? 1 : 0;
    await knex('students').where({ id }).update({ isActive: newStatus });

    res.status(200).json({
      message: `Student ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      isActive: newStatus
    });
  } catch (error) {
    console.error('Error toggling student status:', error);
    res.status(500).json({ error: 'Failed to toggle student status' });
  }
});

// ------------------- Faculties -------------------

app.post('/faculties', async (req, res) => {
  const { name, mobile, address, email, college, password } = req.body;
  if (!name || !mobile || !address || !email || !college || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await knex('faculties').insert({
      id: uuid.v4(),
      name,
      mobile,
      address,
      email,
      college,
      password,
      isActive: 0
    });
    res.status(201).json({ message: 'Faculty created successfully' });
  } catch (error) {
    console.error('Error inserting faculty:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

app.get('/faculties', async (req, res) => {
  try {
    const faculties = await knex('faculties').select();
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculties' });
  }
});

app.delete('/faculties/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await knex('faculties').where({ id }).first();
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    await knex('faculties').where({ id }).del();
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
});

app.put('/faculties/:id/toggle-active', async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await knex('faculties').where({ id }).first();
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const newStatus = faculty.isActive === 0 ? 1 : 0;
    await knex('faculties').where({ id }).update({ isActive: newStatus });

    res.status(200).json({
      message: `Faculty ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      isActive: newStatus
    });
  } catch (error) {
    console.error('Error toggling faculty status:', error);
    res.status(500).json({ error: 'Failed to toggle faculty status' });
  }
});

// ------------------- Login -------------------

app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    if (role === "Admin") {
      if (email === "admin@admin.com" && password === "admin#1947") {
        return res.status(200).json(email);
      } else {
        return res.status(401).json({ error: "Invalid Admin credentials" });
      }
    } else if (role === "Faculty") {
      const faculty = await knex('faculties').where({ email, password }).first();
      if (faculty) return res.status(200).json(email);
    } else if (role === "Student") {
      const student = await knex('students').where({ email, password }).first();
      if (student) return res.status(200).json(email);
    }
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ------------------- Tasks (taskmanage table) -------------------

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await knex('taskmanage').select();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description, assignedTo, priority, status, assignedDate, dueDate } = req.body;

  try {
    const result = await knex('taskmanage').insert({
      title,
      description,
      assignedTo,
      priority,
      status,
      assignedDate,
      dueDate,
    });

    res.status(201).json({ message: 'Task inserted successfully', taskId: result[0] });
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Failed to insert task' });
  }
});


app.get('/admin/dashboard', async (req, res) => {
  try {
    const students = await knex('students');
    const faculties = await knex('faculties');
    const tasks = await knex('taskmanage');
    res.status(200).json({ students, faculties, tasks });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});



app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
