import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { Nav } from "./Nav";
import { Transaction } from "./Transaction";

const POOL_INTERVAL_MS = 10000;

export const TransactionPool = () => {
 const [transactionPoolMap, setTransactionPoolMap] = useState({});
 const navigate = useNavigate();

 useEffect(() => {
  return async () => {
    const response = await fetch('/api/v1/transaction-pool');
    const json = await response.json();
    setTransactionPoolMap(json.transactionPoolMap)
   } 
 },[]);

 useEffect(() => {
  const poolInterval = setInterval(async () => {

        const response = await fetch('/api/v1/transaction-pool');
        const json = await response.json();
        setTransactionPoolMap(json.transactionPoolMap)
        
   }, POOL_INTERVAL_MS)

  return () => {
    clearInterval(poolInterval);
  }
 },[transactionPoolMap]);

 const fetchTransactions = async () => {
   const response = await fetch('/api/v1/mine-transactions');
   if(response.status === 200) {
    toast.info('Success');
    navigate('/blocks');
   } else {
    toast.error('the mine transactions block request did not complete');
   }

 } 

 return(
    <div className="grid justify-center align-middle p-4">
      <h3 className="text-2xl p-4">Transaction Pool</h3>
       <Nav to='/' title='Home'/>
       <button className="bg-green-600 text-white p-1 m-3" onClick={fetchTransactions}>Mine Transactions</button>
       { Object.values(transactionPoolMap).map(transaction => (
        <div key={transaction.id}>
          <hr/>
          <Transaction tx={transaction}/>
        </div>
       ))
       }
    </div>
  )
}