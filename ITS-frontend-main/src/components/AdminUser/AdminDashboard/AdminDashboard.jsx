import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { User, ClipboardList, CalendarCheck2, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalInterns: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });

  const barData = [
    { name: 'Week 1', completed: 12, pending: 7, overdue: 2 },
    { name: 'Week 2', completed: 15, pending: 6, overdue: 1 },
    { name: 'Week 3', completed: 18, pending: 5, overdue: 0 },
    { name: 'Week 4', completed: 14, pending: 7, overdue: 3 }
  ];

  const pieData = [
    { name: 'Excellent', value: 33, color: '#00C49F' },
    { name: 'Good', value: 42, color: '#4285F4' },
    { name: 'Average', value: 21, color: '#FFA500' },
    { name: 'Poor', value: 4, color: '#FF4C4C' }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const internsRes = await axios.get('/api/interns');
        const tasksRes = await axios.get('/api/tasks');
        const totalInterns = internsRes.data.length;
        const totalTasks = tasksRes.data.length;
        const completedTasks = tasksRes.data.filter(task => task.status === 'completed').length;
        const overdueTasks = tasksRes.data.filter(task => task.status === 'overdue').length;

        setDashboardStats({
          totalInterns,
          activeTasks: totalTasks,
          completedTasks,
          overdueTasks
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Dashboard</h1>
      <p className={styles.subheader}>Welcome to your internship management dashboard</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}><User /></div>
          <div>
            <h4>Total Interns</h4>
            <p className={styles.statValue}>{dashboardStats.totalInterns}</p>
            <span className={styles.statPositive}>+12% vs last month</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}><ClipboardList /></div>
          <div>
            <h4>Active Tasks</h4>
            <p className={styles.statValue}>{dashboardStats.activeTasks}</p>
            <span className={styles.statPositive}>+8% vs last month</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}><CalendarCheck2 /></div>
          <div>
            <h4>Completed Tasks</h4>
            <p className={styles.statValue}>{dashboardStats.completedTasks}</p>
            <span>This month</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.iconWrapper}><AlertTriangle /></div>
          <div>
            <h4>Overdue Tasks</h4>
            <p className={styles.statValue}>{dashboardStats.overdueTasks}</p>
            <span className={styles.statNegative}>-2% vs last month</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3>Task Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} className={styles.animatedChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#00C49F" />
              <Bar dataKey="pending" stackId="a" fill="#FFA500" />
              <Bar dataKey="overdue" stackId="a" fill="#FF4C4C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Student Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
