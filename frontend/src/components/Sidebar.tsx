import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="7" height="7" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="10" y="1" width="7" height="7" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="1" y="10" width="7" height="7" rx="2" fill="currentColor" opacity="0.8" />
          <rect x="10" y="10" width="7" height="7" rx="2" fill="currentColor" opacity="0.8" />
        </svg>
      ),
    },
    {
      path: '/documents',
      label: 'Documents',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 2h7l4 4v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      path: '/appointments',
      label: 'Appointments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="6" y1="1" x2="6" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6" cy="12" r="1.2" fill="currentColor" />
          <circle cx="9" cy="12" r="1.2" fill="currentColor" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      path: '/emergency-access',
      label: 'Emergency Access',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2.2l1.8 3.6 4 .6-2.9 2.8.7 3.9L9 11.3l-3.6 1.8.7-3.9L3.2 6.4l4-.6L9 2.2z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          <path d="M9 6.3v3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M7.1 8.2h3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      path: '/health-analytics',
      label: 'Health Analytics',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 12l2.8-3.2 2.2 2.1 4-5.1 1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="6.8" cy="8.8" r="1" fill="currentColor" />
          <circle cx="9" cy="10.9" r="1" fill="currentColor" />
          <circle cx="13" cy="5.8" r="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="6.5" y="1" width="5" height="16" rx="2" fill="white" />
            <rect x="1" y="6.5" width="16" height="5" rx="2" fill="white" />
          </svg>
        </div>
        <span>MediVault</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <button
            key={link.path}
            className={`sidebar-link${location.pathname === link.path ? ' active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>

      <button
        className="sidebar-link"
        onClick={onLogout}
        style={{ margin: '0 12px 8px' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 16H3a1 1 0 01-1-1V3a1 1 0 011-1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <polyline points="12 13 17 9 12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="17" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Logout
      </button>

      <div className="sidebar-user">
        <div className="sidebar-user-name">{user.name}</div>
        <div className="sidebar-user-role">{user.role}</div>
      </div>
    </aside>
  );
}
