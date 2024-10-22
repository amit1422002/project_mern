import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../services/api';
import TaskCard from './TaskCard';
import '../css/KanbanBoard.css';
import addIcon from '../images/add.svg';  // Import the add.svg
import menuIcon from '../images/3dotmenu.svg';  // Import the 3dotmenu.svg
import displayIcon from '../images/Display.svg';
import downIcon from '../images/down.svg';  // Import the down.svg

// Import column SVGs
import todoIcon from '../images/todo.svg';
import inProgressIcon from '../images/in-progress.svg';
import doneIcon from '../images/Done.svg';
import backlogIcon from '../images/Backlog.svg';
import cancelledIcon from '../images/Cancelled.svg';
import noPriorityIcon from '../images/No-priority.svg';
import lowPriorityIcon from '../images/Img - Low Priority.svg';
import mediumPriorityIcon from '../images/Img - Medium Priority.svg';
import highPriorityIcon from '../images/Img - High Priority.svg';
import urgentPriorityIcon from '../images/SVG - Urgent Priority colour.svg';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupBy, setGroupBy] = useState('status');
    const [sortBy, setSortBy] = useState('priority');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchTasks();
            setTasks(response.tickets || []);
            setUsers(response.users || []);
        };
        loadData();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const groupTasks = (tasks) => {
        if (!Array.isArray(tasks)) return {};
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
            const userName = users.find((user) => user.id === task.userId)?.name || 'Unknown User';
            if (!groups[userName]) groups[userName] = [];
            groups[userName].push(task);
            return groups;
        }, {});
    };

    const groupByPriority = (tasks) => {
        const priorityLabels = {
            0: "No priority",
            1: "Low",
            2: "Medium",
            3: "High",
            4: "Urgent"
        };
        return tasks.reduce((groups, task) => {
            const priority = priorityLabels[task.priority] || 'No priority';
            if (!groups[priority]) groups[priority] = [];
            groups[priority].push(task);
            return groups;
        }, {});
    };

    const sortTasks = (tasks) => {
        return [...tasks].sort((a, b) => {
            if (sortBy === 'priority') {
                return b.priority - a.priority;
            } else {
                return a.title.localeCompare(b.title);
            }
        });
    };

    // Mapping SVG icons to column names (excluding user group)
    const getColumnIcon = (group) => {
        if (groupBy === 'user') {
            return null; // No icon for user grouping
        }
        switch (group.toLowerCase()) {
            case 'todo':
                return todoIcon;
            case 'in progress':
                return inProgressIcon;
            case 'done':
                return doneIcon;
            case 'backlog':
                return backlogIcon;
            case 'cancelled':
                return cancelledIcon;
            case 'no priority':
                return noPriorityIcon;
            case 'low':
                return lowPriorityIcon;
            case 'medium':
                return mediumPriorityIcon;
            case 'high':
                return highPriorityIcon;
            case 'urgent':
                return urgentPriorityIcon;
            default:
                return null;
        }
    };

    const groupedTasks = groupTasks(tasks);

    return (
        <div className="kanban-container">
            <nav className="navbar">
                <div className="dropdown">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        <img src={displayIcon} alt="Display" width="16" height="16" />
                        Display
                        <img src={downIcon} alt="Down" width="16" height="16" />
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-content">
                            <div className="dropdown-section" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <label style={{ marginRight: 10 }}>Grouping</label>
                                <div className="custom-select" style={{ position: 'relative', display: 'inline-block' }}>
                                    <select
                                        onChange={(e) => setGroupBy(e.target.value)}
                                        value={groupBy}
                                        style={{ appearance: 'none', paddingRight: '35px' }} // Hides default dropdown arrow
                                    >
                                        <option value="status">Status</option>
                                        <option value="user">User</option>
                                        <option value="priority">Priority</option>
                                    </select>
                                    <img
                                        src={downIcon}
                                        alt="Down"
                                        width="16"
                                        height="16"
                                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="dropdown-section" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <label style={{ marginRight: 10 }}>Ordering</label>
                                <div className="custom-select" style={{ position: 'relative', display: 'inline-block' }}>
                                    <select
                                        onChange={(e) => setSortBy(e.target.value)}
                                        value={sortBy}
                                        style={{ appearance: 'none', paddingRight: '40px' }} // Hides default dropdown arrow
                                    >
                                        <option value="priority">Priority</option>
                                        <option value="title">Title</option>
                                    </select>
                                    <img
                                        src={downIcon}
                                        alt="Down"
                                        width="16"
                                        height="16"
                                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="kanban-board">
                <div className="kanban-columns">
                    {Object.entries(groupedTasks).map(([group, tasks]) => (
                        <div key={group} className="kanban-column">
                            {/* Column header with corresponding icon, title, task count, and icons */}
                            <div className="column-header">
                                <div className="header-left">
                                    {/* Only display icon for non-user groups */}
                                    {groupBy !== 'user' && (
                                        <img src={getColumnIcon(group)} alt={group} className="column-icon" />
                                    )}
                                    <h3>{group} <span className="task-count">{tasks.length}</span></h3> {/* Added class 'task-count' */}
                                </div>

                                <div className="header-right">
                                    {/* Plus icon from local storage */}
                                    <img src={addIcon} alt="Add" className="add-task-icon" />

                                    {/* Three-dot menu icon from local storage */}
                                    <img src={menuIcon} alt="Menu" className="menu-icon" />
                                </div>
                            </div>

                            {/* Render task cards */}
                            {sortTasks(tasks).map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
