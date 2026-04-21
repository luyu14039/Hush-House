import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'reader';
  isSidebarOpen: boolean;
  onSidebarOpen: () => void;
  onSidebarClose: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant = 'default', isSidebarOpen, onSidebarOpen, onSidebarClose }) => {
  const childrenArray = React.Children.toArray(children);
  const leftSidebar = childrenArray[0];
  const mainContent = childrenArray[1];
  const rightSidebar = childrenArray[2];

  return (
    <div className="h-screen bg-obsidian text-parchment font-serif flex flex-col md:flex-row overflow-hidden">

      {/* ── Mobile Top Bar (hidden on md+) ── */}
      <div className="md:hidden flex-shrink-0 flex items-center justify-between px-4 h-12 border-b border-gold/20 bg-midnight/90 backdrop-blur-md z-30">
        <button
          onClick={onSidebarOpen}
          className="p-1.5 text-gold/60 hover:text-gold active:scale-90 transition-all rounded"
          aria-label="打开目录"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <h1 className="font-display text-base text-gold tracking-widest">噤声书屋</h1>
        <div className="w-8" />{/* balance spacer */}
      </div>

      {/* ── Mobile Backdrop Overlay ── */}
      <div
        onClick={onSidebarClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── Left: Catalogue (Sidebar) ── */}
      {/* Mobile: fixed full-height overlay drawer; Desktop: static flex column */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm
          border-r border-gold/40 bg-[#090a12] flex-shrink-0 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 shadow-[4px_0_40px_rgba(212,175,55,0.08)]' : '-translate-x-full'}
          md:relative md:inset-auto md:translate-x-0 md:w-80 md:h-full md:bg-midnight/50 md:shadow-none
        `}
      >
        <div className="p-6 border-b border-gold/30 flex items-start justify-between flex-shrink-0">
          <div>
            <h1 className="font-display text-2xl text-gold tracking-wider">Hush House / 噤声书屋</h1>
            <p className="text-sm text-parchment/60 mt-2 italic">"我登得越高，看见的便越多。"</p>
          </div>
          <button
            onClick={onSidebarClose}
            className="md:hidden ml-3 mt-1 p-1.5 text-gold/40 hover:text-gold transition-colors flex-shrink-0"
            aria-label="关闭目录"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          {leftSidebar}
        </div>
      </aside>

      {/* ── Center: Lectern (Main Content) ── */}
      <main className={`flex-1 min-h-0 relative flex flex-col overflow-hidden ${variant === 'reader' ? 'bg-desk' : 'bg-obsidian'}`}>
        {/* Cosmic Background - Only show if default */}
        {variant === 'default' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0b0c15] to-[#000000] opacity-80"></div>

              {/* Noise Texture */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

              {/* Mystic Circles — three nested rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-gold/5 rounded-full opacity-20 animate-[spin_120s_linear_infinite] pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-gold/10 rounded-full opacity-20 animate-[spin_80s_linear_infinite_reverse] pointer-events-none border-dashed"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-purple/20 rounded-full opacity-15 animate-[spin_55s_linear_infinite] pointer-events-none border-dotted"></div>

              {/* Nebula Color Blobs */}
              <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)', filter: 'blur(50px)' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 65%)', filter: 'blur(50px)' }}></div>
              <div className="absolute top-2/3 left-1/2 w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)', filter: 'blur(40px)' }}></div>

              {/* Stars */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIzMDAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==')] opacity-30 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNDUwIiBjeT0iNDUwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-20" style={{ animationDuration: '7s' }}></div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4 md:p-8 lg:p-16 relative z-10 scrollbar-thin scrollbar-thumb-gold/20">
            {mainContent}
        </div>
      </main>

      {/* ── Right: Fate Loom Sidebar (lg+ only) ── */}
      {rightSidebar && (
        <aside className="hidden lg:block w-80 border-l border-gold/30 bg-midnight/30 flex-shrink-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20">
           {rightSidebar}
        </aside>
      )}
    </div>
  );
};
