import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../services/api';
import TaskCard from './TaskCard';
import '../css/KanbanBoard.css';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [groupBy, setGroupBy] = useState('status'); // default grouping by status
    const [sortBy, setSortBy] = useState('priority'); // default sorting by priority

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchTasks();
            setTasks(response.tickets || []); // Safely access tickets and fall back to an empty array
        };
        loadData();
    }, []);

    const priorityLabels = {
        0: 'No Priority',
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Urgent'
    };

    const groupTasks = (tasks) => {
        if (!Array.isArray(tasks)) return {}; // Ensure tasks is an array before proceeding
        switch (groupBy) {
            case 'status':
                return groupByStatus(tasks);
            case 'user':
                return groupByUser(tasks);
            case 'priority':
                return groupByPriority(tasks);
            default:
                return tasks;
        }
    };

    const groupByStatus = (tasks) => {
        return tasks.reduce((groups, task) => {
            const status = task.status || 'No Status';
            if (!groups[status]) groups[status] = [];
            groups[status].push(task);
            return groups;
        }, {});
    };

    const groupByUser = (tasks) => {
        return tasks.reduce((groups, task) => {
            const user = task.userId || 'Unassigned';
            if (!groups[user]) groups[user] = [];
            groups[user].push(task);
            return groups;
        }, {});
    };

    const groupByPriority = (tasks) => {
        return tasks.reduce((groups, task) => {
            const priority = priorityLabels[task.priority] || 'No Priority';
            if (!groups[priority]) groups[priority] = [];
            groups[priority].push(task);
            return groups;
        }, {});
    };

    const sortTasks = (tasks) => {
        return [...tasks].sort((a, b) => {
            if (sortBy === 'priority') {
                return b.priority - a.priority; // Sorting by priority numbers (higher is more important)
            } else {
                return a.title.localeCompare(b.title); // Sorting alphabetically by title
            }
        });
    };

    const groupedTasks = groupTasks(tasks);

    return (
        <div className="kanban-board">
            <div className="controls">
                <select onChange={(e) => setGroupBy(e.target.value)} value={groupBy}>
                    <option value="status">Group by Status</option>
                    <option value="user">Group by User</option>
                    <option value="priority">Group by Priority</option>
                </select>
                <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                    <option value="priority">Sort by Priority</option>
                    <option value="title">Sort by Title</option>
                </select>
            </div>
            <div className="kanban-columns">
                {Object.entries(groupedTasks).map(([group, tasks]) => (
                    <div key={group} className="kanban-column">
                        <h3>{group}</h3>
                        {sortTasks(tasks).map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
