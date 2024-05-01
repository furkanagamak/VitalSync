import { Link } from 'react-router-dom';


export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2 ">
        <div className="text-7xl mt-10 ml-10 text-primary">
            404
       </div>
       <div className="text-5xl  ml-10 text-primary">
            Sorry, we couldn't find that page. 
       </div>
        <div className="text-2xl mt-10 ml-10 underline flex flex-col">
            <Link to="/home">Click to go back to home</Link>
        </div>
    </div>
  );
}