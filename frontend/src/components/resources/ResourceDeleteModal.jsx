const ResourceDeleteModal = ({ resource, onDelete, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-[#f5f5dc] p-8 rounded-md">
        <div className="text-center mb-4">
          <p className="text-xl font-semibold">
            Are you sure you want to delete:
          </p>
          <p className="text-lg">{resource.name}</p>
          <p className="text-lg">Unique ID: {resource.uniqueIdentifier}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md hover:underline"
          >
            01662d Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDeleteModal;
