import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Headphones, BarChart3, Settings } from 'lucide-react';
import { FeedbackButton } from '../common/FeedbackButton';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
      <FeedbackButton />
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { to: '/', icon: Home, label: '首页', labelEn: 'Home' },
    { to: '/practice', icon: Headphones, label: '练习', labelEn: 'Practice' },
    { to: '/stats', icon: BarChart3, label: '统计', labelEn: 'Stats' },
    { to: '/settings', icon: Settings, label: '设置', labelEn: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {links.map(({ to, icon: Icon, label, labelEn }) => {
          const active = path === to || (to !== '/' && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center py-2 px-4 text-xs transition-colors ${
                active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="mt-0.5 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
