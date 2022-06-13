import { Wallet } from "./Wallet";
import logo from '../assets/logo.svg';
import { Nav } from "./Nav";

export const Home = () => {
  return (
    <div className="grid justify-items-center w-[80%] mt-0 mb-0 ml-auto mr-auto">
      <img src={logo}alt="logo" className="w-[250px] h-[250px] p-4" />
      <h1 className="font-bold text-5xl my-5">Welcome to the blockchain</h1>
      <Nav to='/blocks' title="Blocks"/>
      <Nav to='/new-transaction' title="Create tx"/>
      <Nav to='/transaction-pool' title="Tranaction Pool"/>
      <Wallet/>
    </div>
  );
};
