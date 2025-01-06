import React, { useState, useEffect} from "react";

const menuConfig = [
    {
        roles: ["Manager"],
        items: [
            { icon: <i className="fa fa-fw fa-pie-chart"></i>, title: "Dashboard", to: "/dashboards/manager" },
            { icon: <i className="fa fa-fw fa-indent"></i>, title: "System Configuration", to: "/views/configsystem" },
            { icon: <i className="fa fa-fw fa-users"></i>, title: "Group", to: "/views/group" },
            { icon: <i className="fa fa-fw fa-flag"></i>, title: "Milestones", to: "/apps/milestones" },
        ],
    },
    {
        permissions: ["view_user"],
        items: [
            { icon: <i className="fa fa-fw fa-user"></i>, title: "User", to: "/views/users" },
        ],
    },
    {
        roles: ["Student"],
        items: [
            {
                icon: <i className="fa fa-fw fa-newspaper-o"></i>,
                title: "Project",
                subItems: [
                    { title: "Ongoing Projects", to: "/apps/projects/list" },
                    { title: "Progress", to: "/apps/student/project/progress" },
                    { title: "Document", to: "/apps/files/list" },
                ],
            },
            {
                icon: <i className="fa fa-fw fa-star"></i>,
                title: "Topic",
                subItems: [
                    { title: "Register Topic", to: "/Views/Students/MyTopic" },
                    { title: "Register Topic Mentor", to: "/Views/Students/ViewTopicMentor" },
                ],
            },
            {
                icon: <i className="fa fa-fw fa-tasks"></i>,
                title: "Task",
                subItems: [
                    { title: "Tasks List", to: "/apps/tasks-list" },
                    { title: "My Tasks", to: "/apps/my-tasks-list" },
                ],
            },
            {
                icon: <i className="fa fa-fw fa-users"></i>,
                title: "Group",
                subItems: [
                    { title: "Groups", to: "/Views/Students/Groups" },
                    { title: "My Group", to: "/Views/Students/MyGroup" },
                    { title: "Find Groups", to: "/Views/Students/FindGroups" },
                ],
            },
            { icon: <i className="fa fa-fw fa-weixin"></i>, title: "Chat", to: "/views/chat" },
            { icon: <i className="fa fa-fw fa-flag"></i>, title: "Milestones", to: "/apps/milestones" },
        ],
    },
    {
        roles: ["Mentor"],
        items: [
            { icon: <i className="fa fa-fw fa-pie-chart"></i>, title: "Dashboard", to: "/dashboards/mentor" },
            {
                icon: <i className="fa fa-fw fa-newspaper-o"></i>,
                title: "Project",
                subItems: [
                    { title: "Ongoing Projects", to: "/apps/projects/list" },
                    { title: "My Projects", to: "/Views/projects/ProjectMentor" },
                ],
            },
            {
                icon: <i className="fa fa-fw fa-newspaper-o"></i>,
                title: "Topic",
                subItems: [
                    { title: "Student Topic", to: "/Views/Topic/ApproveTopic" },
                    { title: "My Topics", to: "/Views/Topic/TopicForMentor" },
                ],
            },
            { icon: <i className="fa fa-fw fa-weixin"></i>, title: "Chat", to: "/views/chat" },
            { icon: <i className="fa fa-fw fa-flag"></i>, title: "Milestones", to: "/apps/milestones" },
        ],
    },
    {
        roles: ["Admin"],
        items: [
            { icon: <i className="fa fa-fw fa-lock"></i>, title: "Role Permission", to: "/views/role-permission" },
        ],
    },
    {
        permissions: ["view_timeline"],
        items: [
            { icon: <i className="fa fa-fw fa-calendar"></i>, title: "Timeline", to: "/views/timeline" },
        ],
    },
    {
        permissions: ["view_meeting_schedule"],
        items: [
            { icon: <i className="fa fa-fw fa-calendar-check-o"></i>, title: "Meeting Schedule", to: "/views/meeting-schedule" },
        ],
    },
    {
        permissions: ["view_workshop"],
        items: [
            { icon: <i className="fa fa-pencil-square"></i>, title: "WorkShop", to: "/views/workshop" },
        ],
    },
    {
        permissions: ["view_syllabus"],
        items: [
            { icon: <i className="fa fa-fw fa-book"></i>, title: "Syllabus", to: "/apps/syllabus/exe" },
        ],
    },
];

export default menuConfig;
