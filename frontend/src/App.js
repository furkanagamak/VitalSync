import toast, { Toaster } from "react-hot-toast";
const notify = () => toast("Here is your toast.");

function App() {
  return (
    <>
      <Toaster />
      <div className="text-3xl font-bold">Hello World</div>
      <button onClick={notify}>Make me a toast</button>
    </>
  );
}

export default App;
