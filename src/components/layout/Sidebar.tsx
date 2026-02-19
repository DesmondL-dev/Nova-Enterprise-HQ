import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  X
} from 'lucide-react';
import { useAuth, type Role } from '../../store/AuthContext';

/**
 * @interface SidebarProps
 */
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  allowedRoles: Role[];
}

const navItems: NavItem[] = [
  { name: 'Overview', icon: LayoutDashboard, path: '/', allowedRoles: ['President', 'Director'] },
  { name: 'Orders', icon: ShoppingCart, path: '/orders', allowedRoles: ['President'] },
  { name: 'Inventory', icon: Package, path: '/inventory', allowedRoles: ['President', 'Director'] },
  { name: 'Customers', icon: Users, path: '/customers', allowedRoles: ['President'] },
];

/**
 * Sidebar Component
 * @description Enterprise-grade side navigation. Transforms into a drawer on mobile devices.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { role } = useAuth();
  const location = useLocation();

  const authorizedNavItems = navItems.filter(item => item.allowedRoles.includes(role));

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-[60] w-64 bg-nova-surface border-r border-nova-border flex flex-col transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 flex-shrink-0`}
    >
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-nova-border flex-shrink-0">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded flex items-center justify-center mr-3 transition-colors duration-300 ${role === 'President' ? 'bg-nova-blue' : 'bg-emerald-500'}`}>
            <span className="text-white font-bold text-lg leading-none">N</span>
          </div>
          <span className="text-nova-text font-semibold text-lg tracking-wide">
            NOVA HQ
          </span>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-nova-muted hover:text-nova-text transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {authorizedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // Auto-close drawer on mobile when navigating
              className={`flex items-center px-3 py-2.5 rounded-md transition-all duration-200 group
                ${isActive 
                  ? (role === 'President' ? 'bg-nova-blue/10 text-nova-blue' : 'bg-emerald-500/10 text-emerald-400')
                  : 'text-nova-muted hover:bg-nova-border hover:text-nova-text'
                }`}
            >
              <Icon 
                className={`w-5 h-5 mr-3 transition-colors ${isActive ? (role === 'President' ? 'text-nova-blue' : 'text-emerald-400') : 'text-nova-muted group-hover:text-nova-text'}`} 
              />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Area */}
      <div className="p-4 border-t border-nova-border flex-shrink-0">
        <button className="w-full flex items-center px-3 py-2.5 rounded-md text-nova-muted hover:bg-nova-border hover:text-nova-text transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;