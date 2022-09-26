import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import GlobalStyle from './utils/styles/GlobalStyle'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnePost from './pages/OnePost'
import { ProfilePovider } from './utils/context/Pofile'
import { AuthProvider } from './utils/context/Auth'
import RequireAuth from './components/RequireAuth'
import { SizeDashboardProvider } from './utils/context/SetSizeDashboard'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router >
      <ProfilePovider>
        <AuthProvider>
          <GlobalStyle />
          <SizeDashboardProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } 
              />
              <Route
              path="/:postId"
              element={
                <RequireAuth>
                  <OnePost />
                </RequireAuth>
              }
            />
          </Routes>
          </SizeDashboardProvider>
        </AuthProvider>
      </ProfilePovider>
    </Router>
  </React.StrictMode>
)
