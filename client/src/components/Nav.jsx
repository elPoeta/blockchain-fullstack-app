import { Link } from "react-router-dom";

export const Nav = ({to, title}) => (
  <div className="text-xl text-green-400 flex align-middle font-bold">
    <Link to={to}>{title}</Link>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
 </div>);