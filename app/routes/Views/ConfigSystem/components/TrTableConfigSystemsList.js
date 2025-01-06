import React from "react";
import PropTypes from "prop-types";
import { Media, Button } from "./../../../../components";
import useAuth from "../../../../../hooks/useAuth";

const TrTableConfigSystemsList = ({ config, onEdit }) => {
  const { role } = useAuth();
  return (
    <tr>
      <td className="align-middle">{config.configId}</td>
      <td className="align-middle">
        <Media>
          <Media body>
            <span className="mt-0 d-flex text-decoration-none">
              {config.configName}
            </span>
          </Media>
        </Media>
      </td>
      <td className="align-middle">
        {config.number !== null ? config.number : "N/A"}
      </td>
      <td className="align-middle">
        {config.startDate ? (
          new Date(config.startDate).toLocaleDateString()
        ) : (
          "N/A"
        )}
      </td>
      <td className="align-middle text-right">
        {role === "Manager" && (
          <Button
            color="primary"
            size="sm"
            onClick={onEdit}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-fw fa-pencil mr-2"></i>Edit
          </Button>
        )}
      </td>
    </tr>
  );
};

TrTableConfigSystemsList.propTypes = {
  config: PropTypes.shape({
    configId: PropTypes.number.isRequired,
    configName: PropTypes.string.isRequired,
    number: PropTypes.number,
    startDate: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export { TrTableConfigSystemsList };
