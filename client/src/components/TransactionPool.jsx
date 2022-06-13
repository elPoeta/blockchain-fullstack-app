import { useEffect } from "react";
import { useState } from "react"
import { Nav } from "./Nav";
import { Transaction } from "./Transaction";

export const TransactionPool = () => {
 const [transactionPoolMap, setTransactionPoolMap] = useState({});

 useEffect(() => {
  return async () => {
    const response = await fetch('/api/v1/transaction-pool');
    const json = await response.json();
    setTransactionPoolMap(json.transactionPoolMap)
   } 
 });

 return(
    <div>
      <h3>Transaction Pool</h3>
       <Nav to='/' title='Home'/>
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