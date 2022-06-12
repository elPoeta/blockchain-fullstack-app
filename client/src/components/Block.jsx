import { useState } from "react";
import { Transaction } from "./Transaction";

export const Block = ({ block }) => {
  const [displayTx, setDisplayTx] = useState(false);

  const { timestamp, hash, data} = block; 
  const shortenHash = `${hash.substring(0,15)}...`;
  const dataString = JSON.stringify(data);
  const shortenData = dataString.length > 50 ? `${dataString.substring(0,50)}...` : dataString;

  const renderTransaction = () => (<div className="grid gap-2">{data.map(tx => <Transaction key={tx.id} tx={tx}/>)}</div>);

  return(
    <div className="border-2 border-blue-400 break-words p-4 text-xl flex flex-col gap-3">
      <h4 className="text-pink-500">Date: {new Date(timestamp).toLocaleString()}</h4>
      <h5 className="text-orange-400" data-hash={hash}>Hash: {shortenHash}</h5>
      <div className="flex">
        <i className="cursor-pointer mr-2" onClick={() => setDisplayTx(prev => !prev )}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#60a5fa">
           <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
        </i>
        { displayTx ? renderTransaction() :
         <h6 data-fulldata={dataString}>{shortenData}</h6>
        }
      </div>
    </div>
  )
}