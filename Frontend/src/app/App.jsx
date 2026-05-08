import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '../layouts/AppShell'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Tasks from '../pages/Tasks'
import TaskDetail from '../pages/TaskDetail'
import TaskForm from '../pages/TaskForm'
import Profile from '../pages/Profile'
import NotFound from '../pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
