import { useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';

const Chat = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hovered, setHovered] = useState(false);

  const scrollRef = useRef(null);

  let buttonClassName;
  if (windowWidth < 600 && hovered) {
    buttonClassName = 'full-length-button hovered';
  } else if (windowWidth < 600 && !hovered) {
    buttonClassName = 'full-length-button';
  } else if (windowWidth >= 600 && hovered) {
    buttonClassName = 'short-button hovered';
  } else if (windowWidth >= 600 && !hovered) {
    buttonClassName = 'short-button';
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    socket.on('message_arrives', (data) => {
      // console.log(data);
      setMessages((prevMsg) => [...prevMsg, data]);
    });
  }, [socket]);

  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const clickHandler = async () => {
    if (message !== '') {
      setMessages((prevState) => [
        ...prevState,
        { message: message, author: 'Smirnoff' },
      ]);

      await socket.emit('message_sent', {
        socketId: socket.id,
        message: message,
        author: 'Smirnoff',
      });
      setMessage('');
    }
  };

  return (
    <div className="wrapper">
      <div className="messages">
        {messages &&
          messages.map((msg) => (
            <div
              className={msg.author === 'Smirnoff' ? 'smirnoff' : 'solomon'}
              key={nanoid()}
              ref={scrollRef}
            >
              {' '}
              <div>{msg.message}</div>
              <p> {msg.author} </p>
            </div>
          ))}
      </div>

      <div
        className={
          windowWidth < 600 ? 'message-vertical' : 'message-horizontal'
        }
      >
        <input
          className={windowWidth < 600 ? 'full-length-input' : 'short-input'}
          type="text"
          placeholder="type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={buttonClassName}
          onClick={clickHandler}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chat;
