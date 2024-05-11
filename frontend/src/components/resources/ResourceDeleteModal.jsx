import toast from "react-hot-toast";

const ResourceDeleteModal = ({ resource, onDelete, onCancel }) => {
  const handleDeletionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/resources`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uniqueIdentifier: resource.uniqueIdentifier }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        return toast.error(text);
      }
      toast.success(text);
    } catch (error) {
      toast.error("An error occured while trying to submit your form");
      console.error("Error submitting form:", error.message);
    }
    onDelete();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-[#f5f5dc] p-8 rounded-md border-2 border-primary">
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
            title="Cancel Deletion"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletionSubmit}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-600"
            title="Confirm Deletion"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDeleteModal;
