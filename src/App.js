import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from './store/userSlice';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { showSize } from './store/windowSlice';
import Chat from './pages/Chat';

export default function App() {
  const userID = localStorage.getItem('userId')

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userUid)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid))
        localStorage.setItem('userId', user.uid)

      }
      else {
        dispatch(setUser(null))
        localStorage.setItem('userId', '')
      }

    });
  }, [user]);

  useEffect(() => {
    function handleWindowResize() {
      dispatch(showSize(getWindowSize().innerWidth));
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);


  return (
    <BrowserRouter>
      <Routes >
        < Route path='/chat/:id' element={<Chat />} />
        < Route path='/login' element={<Login />} />
        < Route path='/register' element={<Register />} />
        < Route path='/*' element={<Navigate to="/login" />} />
      </Routes >
    </BrowserRouter>
  );
}

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

