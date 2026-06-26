import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthModal from '@/components/AuthModal';
import NotFound from '@/components/NotFound';
import LiuYaoTest from '@/components/LiuYaoTest';
import LiuYaoResult from '@/components/LiuYaoResult';
import History from '@/components/History';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';
import UserManagement from '@/components/admin/UserManagement';
import AssessmentTypeManagement from '@/components/admin/AssessmentTypeManagement';
import PersonalityDimensionManagement from '@/components/admin/PersonalityDimensionManagement';
import QuestionManagement from '@/components/admin/QuestionManagement';
import BatchManagement from '@/components/admin/BatchManagement';
import TestScheduleManagement from '@/components/admin/TestScheduleManagement';
import TestTakerManagement from '@/components/admin/TestTakerManagement';
import PersonalityAnalysis from '@/components/admin/PersonalityAnalysis';
import ApiKeySettings from '@/components/admin/ApiKeySettings';
import Home from '@/components/Home';
import Test from '@/components/Test';
import Result from '@/components/Result';
import About from '@/components/About';
import SharePage from '@/components/SharePage';
import TypeExplore from '@/components/TypeExplore';
import TypeGallery from '@/components/TypeGallery';
import AiFortunePark from '@/components/AiFortunePark';
import AiTypeManagement from '@/components/admin/AiTypeManagement';
import '@/App.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nb">
        <div className="nb-inner">
          <NavLink to="/" className="nb-logo">
            <span className="nb-logo-icon">🧠</span>
            <span className="nb-logo-text">MBTI</span>
            <span className="nb-logo-badge">Pro Max</span>
          </NavLink>

          <button className="nb-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>

          <div className={`nb-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              🏠 首页
            </NavLink>
            <NavLink to="/test" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              🧪 测试
            </NavLink>
            <NavLink to="/fortune-park" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              🎪 游乐园
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              🧩 人格
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              🎨 画廊
            </NavLink>
            <NavLink to="/liuyao" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              🔮 易经
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              📜 历史
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={({ isActive }) => `nb-link nb-admin ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
                ⚙️ 管理
              </NavLink>
            )}
            <NavLink to="/about" className={({ isActive }) => `nb-link ${isActive ? 'on' : ''}`} onClick={() => setMenuOpen(false)}>
              ℹ️ 关于
            </NavLink>
          </div>

          <div className="nb-user">
            {user ? (
              <>
                <span className="nb-user-name">{user.name}</span>
                <button className="nb-logout" onClick={logout}>👋 退出</button>
              </>
            ) : (
              <button className="nb-login" onClick={() => setShowAuth(true)}>🔑 登录</button>
            )}
          </div>
        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/result" element={<Result />} />
          <Route path="/fortune-park" element={<AiFortunePark />} />
          <Route path="/explore" element={<TypeExplore />} />
          <Route path="/gallery" element={<TypeGallery />} />
          <Route path="/liuyao" element={<LiuYaoTest />} />
          <Route path="/liuyao-result" element={<LiuYaoResult />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="assessment-types" element={<AssessmentTypeManagement />} />
            <Route path="personality-dimensions" element={<PersonalityDimensionManagement />} />
            <Route path="questions" element={<QuestionManagement />} />
            <Route path="batches" element={<BatchManagement />} />
            <Route path="schedules" element={<TestScheduleManagement />} />
            <Route path="test-takers" element={<TestTakerManagement />} />
            <Route path="analysis" element={<PersonalityAnalysis />} />
            <Route path="ai-types" element={<AiTypeManagement />} />
            <Route path="api-settings" element={<ApiKeySettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>

      <footer className="footer">
        <p>© 2026 MBTI性格测试与就业推荐系统</p>
        {user?.role === 'ADMIN' && (
          <NavLink to="/admin" className="footer-admin-link">管理后台</NavLink>
        )}
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/share" element={<SharePage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
