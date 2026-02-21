import { useState, useEffect, useCallback } from 'react';

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 使用 useCallback 缓存函数引用，避免触发不必要的重新渲染
  const openPalette = useCallback(() => setIsOpen(true), []);
  const closePalette = useCallback(() => setIsOpen(false), []);
  const togglePalette = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 兼容 Mac 的 Cmd 键 (metaKey) 和 Windows 的 Ctrl 键 (ctrlKey)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault(); // 极其重要：拦截浏览器默认的搜索快捷键
        togglePalette();
      }
      
      // 增加 UX 细节：按 Esc 键可以快速关闭面板
      if (event.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    // 在全局 Window 对象上挂载键盘监听器
    window.addEventListener('keydown', handleKeyDown);

    // 卸载/清理函数 (Cleanup Function)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePalette, isOpen, closePalette]);

  return {
    isOpen,
    openPalette,
    closePalette,
    togglePalette,
  };
};