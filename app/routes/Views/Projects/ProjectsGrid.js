import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';
import config from './../../../../config';

import { CardColumns } from './../../../components';
import { ProjectsCardGrid } from "../../Views/Projects/components/ProjectsCardGrid";
import { Paginations } from "../../components/Paginations";

const ProjectsGrid = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}api/projects`, {
                  withCredentials: true,
              });
                
              if (response.data.success) {
                setProjects(response.data.data);
              }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <React.Fragment>
      <CardColumns>
        {
          projects.map((project) => (
            <ProjectsCardGrid key={project.projectId} project={project} />
          ))
        }
      </CardColumns>
      <div className="d-flex justify-content-center">
        <Paginations />
      </div>
    </React.Fragment>
  );
};

export default ProjectsGrid;
