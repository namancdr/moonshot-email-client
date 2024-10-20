import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import EmailClientContainer from './components/EmailClientContainer';
import { EmailProvider } from './context/EmailContext';
import './global.css';

const App: React.FC = () => {
  return (
    <EmailProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<EmailClientContainer />} />
            <Route path="/email/:id" element={<EmailClientContainer />} />
          </Routes>
        </div>
      </Router>
    </EmailProvider>
  );
};

export default App;
