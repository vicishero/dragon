import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Team } from './pages/Team';
import { Ecology } from './pages/Ecology';
import { BuyModal, useModal } from './components/common/Modal';

function AppContent() {
  const { isBuyModalOpen, closeBuyModal } = useModal();
  const location = useLocation();

  // 保留URL参数的重定向组件
  const NavigateWithParams = () => {
    return <Navigate to={`/home${location.search}${location.hash}`} replace />;
  };

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/ecology" element={<Ecology />} />
          <Route path="/" element={<NavigateWithParams />} />
          <Route path="*" element={<NavigateWithParams />} />
        </Routes>
      </Layout>
      <BuyModal isOpen={isBuyModalOpen} onClose={closeBuyModal} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
