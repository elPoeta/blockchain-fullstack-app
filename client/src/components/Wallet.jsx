import { useEffect, useState } from "react";

export const Wallet = () => {
  const [wallet, setWallet] = useState({});

  useEffect(() => {
    return async () => {
      const response = await fetch("/api/v1/wallet");
      const json = await response.json();
      setWallet(json);
    };
  }, []);
  return (
    <div className="w-[500px] break-words text-2xl">
      <h3 className="p-3"><span className="text-orange-400">Address:</span> {wallet.address}</h3>
      <h3 className="p-3"><span className="text-pink-600">Balance:</span> {wallet.balance}</h3>
    </div>
  );
};

