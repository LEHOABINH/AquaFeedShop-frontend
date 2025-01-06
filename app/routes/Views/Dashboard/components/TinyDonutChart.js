import React from 'react';
import { PieChart, Pie, Cell, Text } from 'recharts';
import colors from './../../../../colors';

const TinyDonutChart = ({ groups, dataDashboard, type ,projects}) => {
    let data = [];
    let COLORS = [];

    if (type === "group1") {
        // Safely calculate values with optional chaining and default values
        const initialized = groups?.filter(group => group?.subjectId === 1 && group?.status === "Initialized").length || 0;
        const eligible = groups?.filter(group => group?.subjectId === 1 && group?.status === "Eligible").length || 0;
        const approved = groups?.filter(group => group?.subjectId === 1 && group?.status === "Approved").length || 0;
        const overdue = groups?.filter(group => group?.subjectId === 1 && group?.status === "Overdue").length || 0;

        data = [
            { name: 'Initialized', value: initialized },
            { name: 'Eligible', value: eligible },
            { name: 'Approved', value: approved },
            { name: 'Overdue', value: overdue },
        ];
        COLORS = [colors['yellow'], colors['blue'], colors['success'], colors['red']];
    }

    if (type === "group2") {
        // Safely calculate values with optional chaining and default values
        const initialized = groups?.filter(group => group?.subjectId === 2 && group?.status === "Initialized").length || 0;
        const eligible = groups?.filter(group => group?.subjectId === 2 && group?.status === "Eligible").length || 0;
        const approved = groups?.filter(group => group?.subjectId === 2 && group?.status === "Approved").length || 0;
        const overdue = groups?.filter(group => group?.subjectId === 2 && group?.status === "Overdue").length || 0;

        data = [
            { name: 'Initialized', value: initialized },
            { name: 'Eligible', value: eligible },
            { name: 'Approved', value: approved },
            { name: 'Overdue', value: overdue },
        ];
        COLORS = [colors['yellow'], colors['blue'], colors['success'], colors['red']];
    }

    if (type === "topic") {
        const pending = dataDashboard?.regTopics?.filter(topic => topic?.status === true).length || 0;
        const rejected = dataDashboard?.regTopics?.filter(topic => topic?.status === false).length || 0;
        const approved = dataDashboard?.projects?.filter(project => project?.topicId !== null).length || 0;

        data = [
            { name: 'Pending', value: pending },
            { name: 'Rejected', value: rejected },
            { name: 'Approved', value: approved },
        ];
        COLORS = [colors['yellow'], colors['red'], colors['success']];
    }

    if (type === "project") {
        const inProgress = dataDashboard?.projects?.filter(project => project?.status === "In_Progress").length || 0;
        const completed = dataDashboard?.projects?.filter(project => project?.status === "Completed").length || 0;

        data = [
            { name: 'InProgress', value: inProgress },
            { name: 'Completed', value: completed },
        ];
        COLORS = [colors['yellow'], colors['success']];
    }

    if (type === "projectManager1") {
        const inProgress = projects?.filter(project => project?.status === "In_Progress" && project?.subjectId === 1).length || 0;
        const completed = projects?.filter(project => project?.status === "Completed"&& project?.subjectId === 1).length || 0;

        data = [
            { name: 'InProgress', value: inProgress },
            { name: 'Completed', value: completed },
        ];
        COLORS = [colors['yellow'], colors['success']];
    }

    if (type === "projectManager2") {
        const inProgress = projects?.filter(project => project?.status === "In_Progress" && project?.subjectId === 2).length || 0;
        const completed = projects?.filter(project => project?.status === "Completed"&& project?.subjectId === 2).length || 0;

        data = [
            { name: 'InProgress', value: inProgress },
            { name: 'Completed', value: completed },
        ];
        COLORS = [colors['yellow'], colors['success']];
    }

    if (data.every(item => item.value === 0)) {
        return (
            <PieChart width={80} height={80}>
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="12">
                    No Data
                </text>
            </PieChart>
        );
    }

    return (
        <PieChart width={80} height={80}>
            <Pie
                data={data}
                dataKey="value"
                stroke={colors['white']}
                innerRadius={26}
                outerRadius={35}
                fill="#8884d8"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    );
};

export { TinyDonutChart };
