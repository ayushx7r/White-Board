import './App.css'
import BoardProvider from "./store/BoardProvider";
import Board from "./Components/Board/Board";
import ToolProvider from './store/ToolProvider';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {

  

  return (
    <ToolProvider>
      <BoardProvider>
        <Board />
        <SpeedInsights />
      </BoardProvider>
    </ToolProvider>
  )
}

export default App
