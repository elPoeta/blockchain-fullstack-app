import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './Home';
import { Blocks } from './Blocks';
import { NotFound } from './NotFound';

export const Router  = () => {
  return (
    <div className='min-h-screen flex-col justify-items-center'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blocks' element={<Blocks />} />
          <Route path='/notFound' element={<NotFound />} />
          <Route path="*" element={<Navigate to="notFound" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};