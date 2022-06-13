import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Home } from './Home';
import { NotFound } from './NotFound';

export const Router  = () => {
  return (
    <div className='min-h-screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/notFound' element={<NotFound />} />
          <Route path="*" element={<Navigate to="notFound" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};