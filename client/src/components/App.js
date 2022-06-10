import { useEffect, useState } from "react";

const App = () => {
  const [wallet, setWallet] = useState({});

  useEffect(() => {
    return async () => {
      const response = await fetch("/api/v1/wallet");
      const json = await response.json();
      console.log("## ", json);
      setWallet(json);
    };
  }, []);
  return (
    <div className="">
      <h3>Address: {wallet.address}</h3>
      <h3>Balance: {wallet.balance}</h3>
    </div>
  );
};

export default App;
