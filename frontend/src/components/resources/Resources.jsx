import ResourceView from "./ResourceView";
import ResourceCreate from "./ResourceCreate";
import ResourceEdit from "./ResourceEdit";
import { useState } from "react";

const Resources = () => {
  const [resourcePages, setResoucePages] = useState("View");
  const [targetResource, setTargetResource] = useState(null);

  const navToCreateResource = () => {
    setResoucePages("Create");
  };

  const navToViewResource = () => {
    setResoucePages("View");
  };

  const navToEditResource = (resource) => {
    setTargetResource(resource);
    setResoucePages("Edit");
  };

  return (
    <>
      {resourcePages === "View" && (
        <ResourceView
          navToCreateResource={navToCreateResource}
          navToEditResource={navToEditResource}
        />
      )}
      {resourcePages === "Create" && (
        <ResourceCreate navToViewResource={navToViewResource} />
      )}
      {resourcePages === "Edit" && (
        <ResourceEdit
          navToViewResource={navToViewResource}
          resource={targetResource}
        />
      )}
    </>
  );
};

export default Resources;
