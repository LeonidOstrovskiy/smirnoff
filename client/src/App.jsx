import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './components';

const baseUrl = import.meta.env.VITE_BASE_URL;

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {}, [socket]);

  return (
    <div className="app">
      {socket ? <Chat socket={socket} /> : <div> not connected </div>}
    </div>
  );
}

export default App;
