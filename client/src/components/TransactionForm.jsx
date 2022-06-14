import { useState } from "react";
import { toast } from 'react-toastify'
import {Nav} from './Nav';

export const TransactionForm  = () => {
 const [transaction, setTransaction] = useState({ recipient: '', amount: 0 });
 const handleChange = ev => {
  ev.preventDefault();
  setTransaction( prev => {return{...prev, [ev.target.name]: ev.target.value}});
 } 

 const handleSubmit = async (ev) => {
  ev.preventDefault();
  const response = await fetch('/api/v1/transaction', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(transaction) 
  });
   const json = await response.json();
   console.log(json)
   toast.info("Transaction success")
 }

 return(
    <div className="w-[80%] ml-auto mr-auto p-5 text-center">
      <h3 className="font-bold text-2xl text-blue-400 text-center p-3">New transaction</h3>
      <div className="flex justify-center p-3">
        <Nav to="/" title="Home"/>
      </div>
     <form onSubmit={handleSubmit} className="grid justify-center gap-4">
      <input className="border-white border-2 p-4" type="text" id="recipient" name="recipient" placeholder="recipient" value={transaction.recipient} onChange={ev => handleChange(ev)}/>
      <input className="border-white border-2 p-4" type="number" id="amount" name="amount" placeholder="amount" value={transaction.amount} onChange={ev => handleChange(ev)}/>
      <input className="border-pink-600 border-[3px] p-4 cursor-pointer text-pink-600 font-bold" type="submit" value="send"/>
     </form>
    </div>
  );
};