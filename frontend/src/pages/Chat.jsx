import React, { useState, useRef, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Chat.css';
import Loader from '../Components/Loader';
import '../Components/Loader.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: '👋 Hello! I’m your AI Assistant. What would you like to learn today?' },
  ]);
  
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username,setUsername]=useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || decoded.sub); // 
    } catch (err) {
      console.error("Token decode failed", err);
    }
  }
}, []);

const handleArticlesFetch = async () => {
  if (!input.trim()) return;

  setMessages((prev) => [...prev, { type: 'user', text: `📄 Show me articles for: ${input}` }]);
  setInput('');
  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    const response = await API.get(`/articles?topic=${encodeURIComponent(input)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { topic, articles } = response.data;

    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text: {
          type: 'articles',
          topic,
          articles
        }
      }
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text: '⚠️ Failed to fetch articles. Please try again later.'
      }
    ]);
    console.error('Error fetching articles:', error);
  }

  setLoading(false);
};


const handleYouTubeFetch = async () => {
  if (!input.trim()) return;

  setMessages((prev) => [...prev, { type: 'user', text: `📺 Show me YouTube videos for: ${input}` }]);
  setInput('');
  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    const response = await API.get(`/youtube/?topic=${encodeURIComponent(input)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { topic, videos } = response.data;
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text: {
          type: 'youtube',
          topic,
          videos
        }
      }
    ]);

  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text: '⚠️ Failed to fetch YouTube videos. Please try again later.'
      }
    ]);
    console.error('Error fetching YouTube videos:', error);
  }

  setLoading(false);
};

const handleClearLastAIResponse = () => {
  setMessages((prevMessages) => {
    for (let i = prevMessages.length - 1; i >= 0; i--) {
      if (prevMessages[i].type === 'ai') {
        return [...prevMessages.slice(0, i), ...prevMessages.slice(i + 1)];
      }
    }
    return prevMessages;
  });
};



  const handleSend = async(e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);
    setLoading(true);
    try {
    const token = localStorage.getItem('token');
    const response = await API.post(
      `/roadmap/?topic=${encodeURIComponent(input)}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text :{
          topic: response.data.topic,
          roadmap:response.data.roadmap
        }
      }
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        text: '⚠️ Failed to fetch roadmap. Please try again later.'
      }
    ]);
    console.error('Error fetching roadmap:', error);
  }
  setLoading(false);
  };

  const handleNewChat = () => {
    setMessages([
      { type: 'ai', text: '👋 Hello! I’m your AI Assistant. What would you like to learn today?' }
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLogout=async()=>{
    try {
      await API.post('/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      alert('Logout failed');
      console.error(error);
    }
  }

  return (
    <div className="chat-wrapper">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="user-info">
          <div className="avatar">👤</div>
          <div className="email">{username}</div>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="chat-container">
        <header className="chat-header">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>💬 AI Chat</h1>
          <button className="new-chat-btn" onClick={handleNewChat}>🧹 New Chat</button>
        </header>

        <main className="chat-body">
        {messages.map((msg, idx) => (
  <div key={idx} className={`chat-bubble ${msg.type === 'user' ? 'user-msg' : 'ai-msg'}`}>
    {typeof msg.text === 'string' ? (
  msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)
) : msg.text.type === 'youtube' ? (
  <>
    <strong>🎥 YouTube Videos for: {msg.text.topic}</strong>
    <div className="video-cards">
      {msg.text.videos.map((video, index) => {
        const videoId = new URLSearchParams(new URL(video.url).search).get('v');
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        return (
          <div key={index} className="video-card">
            <img src={thumbnail} alt={video.title} />
            <div className="video-info">
              <a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a>
            </div>
          </div>
        );
      })}
    </div>
  </>
) : msg.text.type === 'articles' ? (
  <>
    <strong>📄 Articles for: {msg.text.topic.trim()}</strong>
    <div className="article-cards">
      {msg.text.articles.map((article, index) => (
        <div key={index} className="article-card">
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            <h4 style={{ margin: '4px 0' }}>📘 {article.title}</h4>
          </a>
          <p style={{ fontSize: '0.9em', color: '#555' }}>{article.snippet}</p>
        </div>
      ))}
    </div>
  </>
) : (
  <>
    <strong>📚 Roadmap for: {msg.text.topic}</strong>
    <pre style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
      {msg.text.roadmap}
    </pre>
  </>
)}

  </div>
))}
          {loading && <Loader />}
          <div ref={chatEndRef} />
        </main>

        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Enter the topic to search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
          <button type="button" onClick={handleYouTubeFetch} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}>📺 Get YouTube Videos</button>

          <button type="button" onClick={handleArticlesFetch} style={{ backgroundColor: 'purple', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}> 📄 Get Articles</button>
          <button
            type="button"
            onClick={handleClearLastAIResponse}
            style={{ backgroundColor: 'black', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}
          >
            🧹 Clear Last Response
          </button>

        </form>
      </div>
    </div>
  );
};

export default Chat;
