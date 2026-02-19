import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, ShieldAlert, Menu } from 'lucide-react';
import { useAuth, type Role } from '../../store/AuthContext';

/**
 * @interface HeaderProps
 * @description Defines the expected props for the Header component, specifically for mobile drawer control.
 */
interface HeaderProps {
  onMenuToggle: () => void;
}

/**
 * Header Component
 * @description Top navigation bar featuring mobile toggle and dynamic RBAC role switcher.
 */
const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { role, setRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (newRole: Role) => {
    setRole(newRole);
    setIsDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-nova-surface/80 backdrop-blur-md border-b border-nova-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left Area: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center flex-1">
        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={onMenuToggle}
          className="mr-4 md:hidden p-1 text-nova-muted hover:text-nova-text transition-colors focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search (Hidden on ultra-small screens to preserve layout) */}
        <div className="hidden sm:flex items-center max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="w-full bg-nova-bg border border-nova-border text-nova-text text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-nova-blue focus:ring-1 focus:ring-nova-blue transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right: Actions & Role Switcher */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="relative p-2 text-nova-muted hover:text-nova-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="hidden md:block h-6 w-px bg-nova-border mx-1"></div>

        {/* Dynamic RBAC Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 rounded-md transition-colors cursor-pointer border ${isDropdownOpen ? 'bg-nova-bg border-nova-border' : 'border-transparent hover:bg-nova-border'}`}
          >
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${role === 'President' ? 'bg-gradient-to-tr from-nova-blue to-purple-500' : 'bg-gradient-to-tr from-emerald-500 to-teal-600'}`}>
              <span className="text-white text-[10px] md:text-xs font-bold">{role === 'President' ? 'HQ' : 'SC'}</span>
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="text-sm font-medium text-nova-text leading-tight">Desmond</span>
              <span className="text-xs text-nova-muted leading-tight">
                {role === 'President' ? 'Regional President' : 'SC Director'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-nova-muted ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 md:w-56 bg-nova-surface border border-nova-border rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-nova-border bg-nova-bg/50">
                <span className="text-xs font-semibold text-nova-muted uppercase tracking-wider flex items-center">
                  <ShieldAlert className="w-3 h-3 mr-1.5" /> Access Level
                </span>
              </div>
              <div className="p-1">
                <button 
                  onClick={() => handleRoleSwitch('President')}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between ${role === 'President' ? 'bg-nova-blue/10 text-nova-blue font-medium' : 'text-nova-text hover:bg-nova-bg'}`}
                >
                  Regional President
                  {role === 'President' && <div className="w-2 h-2 rounded-full bg-nova-blue flex-shrink-0"></div>}
                </button>
                <button 
                  onClick={() => handleRoleSwitch('Director')}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between mt-1 ${role === 'Director' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-nova-text hover:bg-nova-bg'}`}
                >
                  SC Director
                  {role === 'Director' && <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;