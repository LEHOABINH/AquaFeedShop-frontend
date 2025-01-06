import React, { useState, useEffect } from "react";
import { v4 as uid } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

import { ProjectsList } from "../components/ProjectsList";

// Reorder function remains the same
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DraggableProjects = ({ dataProjectsDashboard }) => {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Map dataProjectsDashboard to the required structure
    const mappedProjects = dataProjectsDashboard.map(project => {
      // Calculate progress value, complete tasks, and other metrics
      const taskMetrics = project.taskDashboards || [];
      const completeTasks = taskMetrics.filter(task => task.status === "Completed").length;
      const totalTasks = taskMetrics.length;
      const inProgressTasks = taskMetrics.filter(task => task.status === "In_Progress").length;
      const overdueTasks = taskMetrics.filter(task => task.status === "Overdue").length;
      const notStartedTasks = taskMetrics.filter(task => task.status === "Not_Started").length;

      // Calculate progress value (assuming average of progress percentages)
      const progressValue = project.progressPercentage;
      const badgeColor = project.status === "In_Progress" ? "warning" : "secondary";
      const badgeTitle = project.status.replace("_", " ");

      return {
        id: uid(),
        title: project.topicName,
        badgeColor,
        badgeTitle,
        progressValue: progressValue,
        completeValue: completeTasks,
        myTasksValue: totalTasks,
        daysDueValue: Math.ceil(
          (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
        ), // Calculate days remaining
      };
    });

    setProjects(mappedProjects);
  }, [dataProjectsDashboard]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedProjects = reorder(
      projects,
      result.source.index,
      result.destination.index
    );

    setProjects(reorderedProjects);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            className="list-group list-group-flush"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {_.map(projects, ({ id, ...project }, index) => (
              <Draggable key={id} draggableId={id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className="list-group-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      borderLeft:
                        snapshot.isDragging ? "1px solid rgba(0, 0, 0, 0.125)" : "",
                      borderRight:
                        snapshot.isDragging ? "1px solid rgba(0, 0, 0, 0.125)" : "",
                    }}
                  >
                    <ProjectsList {...project} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export { DraggableProjects };