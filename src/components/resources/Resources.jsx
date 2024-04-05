import ResourceView from "./ResourceView";
import ResourceCreate from "./ResourceCreate";
import ResourceEdit from "./ResourceEdit";
import { useState } from "react";

const Resources = () => {
  const [resourcePages, setResoucePages] = useState("View");
  const [targetResource, setTargetResource] = useState(null);

  const navToEditResource = (resource) => {
    setTargetResource(resource);
    setResoucePages("Edit");
  };

  const navToViewResource = () => {
    setResoucePages("View");
  };

  return (
    <>
      {resourcePages === "View" && (
        <ResourceView navToEditResource={navToEditResource} />
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
