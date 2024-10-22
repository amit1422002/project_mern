import React from 'react';
import '../css/TaskCard.css';

const TaskCard = ({ task, user }) => {
    return (
        <div className="task-card">
            <div className="task-header">
                <h5>{task.id}</h5>
                <div className="task-user-avatar">
                    {user && (
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}`}
                            alt={user.name}
                            className="avatar"
                        />
                    )}
                </div>
            </div>
            <div className="task-content">
                <h4>{task.title}</h4>
                <span className="task-tag">{task.tag[0]}</span>
            </div>
        </div>
    );
};

export default TaskCard;
