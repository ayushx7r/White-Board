import './App.css'
import {useEffect} from 'react'
import Board from "./Components/Board/Board";
import ToolProvider from './store/ToolProvider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import Home from './Components/Home/Home';
import BoardProvider from './store/BoardProvider';

const router = createBrowserRouter([
  {
    path : '/login',
    element : <Login />
  },
  {
    path: '/:canvasId', 
    element : <ToolProvider>
      <BoardProvider>
        <Board />
      </BoardProvider>
    </ToolProvider>
  },
  {
    path : '/signup',
    element : <Signup />
  },
  {
    path : '/',
    element : <Home />
  }
])

function App() {



  return (
    <RouterProvider router={router} />
  )
}

export default App
