import './App.css'
import BoardProvider from "./store/BoardProvider";
import Board from "./Components/Board/Board";
import ToolProvider from './store/ToolProvider';

function App() {

  

  return (
    <ToolProvider>
      <BoardProvider>
        <Board />
      </BoardProvider>
    </ToolProvider>
  )
}

export default App
