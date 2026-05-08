import './App.css'
import {useEffect} from 'react'
import Board from "./Components/Board/Board";
import ToolProvider from './store/ToolProvider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Home from './Components/Home/Home';

const router = createBrowserRouter([
  {
    path : '/login',
    element : <Login />
  },
  {
    path: '/home/:canvasId', 
    element : <Board />
  },
  {
    path : '/signup',
    element : <Signup />
  },
  {
    path : '/home',
    element : <Home />
  }
])

function App() {



  return (
    <RouterProvider router={router} />
  )
}

export default App
