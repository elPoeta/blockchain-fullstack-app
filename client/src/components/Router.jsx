import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { Home } from './Home';
import { Blocks } from './Blocks';
import { NotFound } from './NotFound';
import { TransactionForm } from './TransactionForm';
import { TransactionPool } from './TransactionPool';

export const Router  = () => {
  return (
    <div className='min-h-screen flex-col justify-items-center'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blocks' element={<Blocks />} />
          <Route path='/new-transaction' element={<TransactionForm/>} />
          <Route path='/transaction-pool' element={<TransactionPool />} />
          <Route path='/notFound' element={<NotFound />} />
          <Route path="*" element={<Navigate to="notFound" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
};