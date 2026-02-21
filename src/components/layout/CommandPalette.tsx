import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { useNavigate } from 'react-router-dom';

const QUICK_ACTIONS = [
  { id: 'overview', label: 'Go to Overview', path: '/' },
  { id: 'orders', label: 'Manage Orders', path: '/orders' },
  { id: 'inventory', label: 'Check Inventory', path: '/inventory' },
  { id: 'customers', label: 'Search Customers', path: '/customers' },
];

const CommandPalette = () => {
  const { isOpen, closePalette } = useCommandPalette();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // NEW: Track the index of the currently highlighted action
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSelectedIndex(0); // Reset selection to the top when opened
    }
  }, [isOpen]);

  // NEW: Keyboard Navigation Interceptor
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent scrolling the page
        // Loop back to top if at the bottom
        setSelectedIndex((prev) => (prev + 1) % QUICK_ACTIONS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Loop to bottom if at the top
        setSelectedIndex((prev) => (prev - 1 + QUICK_ACTIONS.length) % QUICK_ACTIONS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Execute the action that is currently highlighted
        handleAction(QUICK_ACTIONS[selectedIndex].path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]); // Dependency on selectedIndex is crucial here!

  const handleAction = (path: string) => {
    navigate(path);
    closePalette();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[30%] left-1/2 z-[1000] w-full max-w-lg bg-[#0f0f0f] border border-[#222] rounded-lg shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-[#222]">
              <span className="text-[#007CED] mr-3 font-mono">❯</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-[#e5e5e5] placeholder-[#666] outline-none font-mono text-sm"
              />
              <span className="text-[10px] font-mono text-[#666] bg-[#1a1a1a] px-2 py-1 rounded border border-[#333]">
                ESC
              </span>
            </div>

            <div className="p-2">
              <h3 className="text-[10px] font-mono text-[#666] uppercase tracking-widest px-3 py-2">
                Quick Actions
              </h3>
              <ul className="space-y-1">
                {QUICK_ACTIONS.map((action, index) => (
                  <li key={action.id}>
                    <button
                      onClick={() => handleAction(action.path)}
                      onMouseEnter={() => setSelectedIndex(index)} // Sync mouse hover with keyboard focus
                      // NEW: Dynamic styling based on selectedIndex
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors font-mono cursor-pointer group ${
                        selectedIndex === index 
                          ? 'bg-[#1a1a1a] text-[#007CED]' 
                          : 'text-[#ccc] hover:bg-[#1a1a1a] hover:text-[#007CED]'
                      }`}
                    >
                      <span>{action.label}</span>
                      <span className={`transition-opacity ${selectedIndex === index ? 'opacity-100 text-[#007CED]' : 'opacity-0'}`}>
                        ↵
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;