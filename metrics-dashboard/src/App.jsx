import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">M</div>
        </div>
        <p className="sidebar-label">Navbar</p>
        <nav className="sidebar-nav">
          <a className="nav-item active">
            Dashboard
          </a>
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          header
        </header>
        <Dashboard />
      </div>
    </div>
  );
}