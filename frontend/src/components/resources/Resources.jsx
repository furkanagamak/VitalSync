import ResourceView from "./ResourceView";
import ResourceCreate from "./ResourceCreate";
import ResourceEdit from "./ResourceEdit";
import { useState } from "react";

const Resources = () => {
  const [resources, setResources] = useState(null);
  const [resourcePages, setResoucePages] = useState("View");
  const [targetResource, setTargetResource] = useState(null);

  const navToEditResource = (resource) => {
    setTargetResource(resource);
    setResoucePages("Edit");
  };

  const navToViewResource = () => {
    setResoucePages("View");
  };

  const changeResourceById = (uniqueIdentifier, newResource) => {
    if (resources)
      setResources((resources) =>
        resources.map((resource) => {
          if (resource.uniqueIdentifier === uniqueIdentifier) {
            return newResource;
          } else {
            return resource;
          }
        })
      );
  };

  return (
    <>
      {resourcePages === "View" && (
        <ResourceView
          resources={resources}
          setResources={setResources}
          navToEditResource={navToEditResource}
        />
      )}
      {resourcePages === "Edit" && (
        <ResourceEdit
          navToViewResource={navToViewResource}
          resource={targetResource}
          changeResourceById={changeResourceById}
        />
      )}
    </>
  );
};

export default Resources;
