import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Team } from './pages/Team';
import { Ecology } from './pages/Ecology';
import { BindModal, useModal } from './components/common/Modal';
import { useWallet } from './hooks/useWallet';

function AppContent() {
  const { isBindModalOpen, closeBindModal, openBindModal } = useModal();
  const { isConnected } = useWallet();
  const [hasShownModal, setHasShownModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isConnected && !hasShownModal) {
      openBindModal();
      setHasShownModal(true);
    }
  }, [isConnected, hasShownModal, openBindModal]);

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
      <BindModal isOpen={isBindModalOpen} onClose={closeBindModal} />
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
