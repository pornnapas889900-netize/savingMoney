import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './components/ui/Toast'
import Layout from './components/layout/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Deposit from './pages/Deposit'
import Withdraw from './pages/Withdraw'
import History from './pages/History'
import Reports from './pages/Reports'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/withdraw" element={<Withdraw />} />
                <Route path="/history" element={<History />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AppProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
