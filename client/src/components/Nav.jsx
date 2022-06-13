import { Link } from "react-router-dom";

export const Nav = ({to, title}) => <div className="text-xl text-green-400"><Link to={to}>{title}</Link></div>