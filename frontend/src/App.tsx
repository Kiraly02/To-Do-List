import './App.css';
import CategoryList from './components/CategoryList';
import TaskList from './components/TaskList';
import { Link, Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <nav className="navbar sticky-top navbar-dark bg-dark">
          <div className="container-fluid">
            <ul className="navbar-nav d-flex flex-row">
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/tasks">Tasks</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link" to="/categories">Categories</Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/categories" element={<CategoryList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
