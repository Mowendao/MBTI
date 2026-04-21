import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Test from './components/Test';
import Result from './components/Result';
import About from './components/About';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="navbar-container">
              <NavLink to="/" className="navbar-logo">
                MBTI系统
              </NavLink>
              <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                  首页
                </NavLink>
                <NavLink to="/test" className={({ isActive }) => isActive ? 'active' : ''}>
                  开始测试
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                  关于
                </NavLink>
              </div>
            </div>
          </nav>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
            <Route path="/result" element={<Result />} />
            <Route path="/about" element={<About />} />
          </Routes>
          
          <footer className="footer">
            <p>© 2026 MBTI性格测试与就业推荐系统</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App