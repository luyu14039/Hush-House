import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  const leftSidebar = childrenArray[0];
  const mainContent = childrenArray[1];
  const rightSidebar = childrenArray[2];

  return (
    <div className="min-h-screen bg-obsidian text-parchment font-serif flex flex-col md:flex-row overflow-hidden">
      {/* Left: Catalogue (Sidebar) */}
      <aside className="w-full md:w-80 border-r border-gold/30 bg-midnight/50 flex-shrink-0 flex flex-col h-screen">
        <div className="p-6 border-b border-gold/30">
          <h1 className="font-display text-2xl text-gold tracking-wider">噤声书屋</h1>
          <p className="text-sm text-parchment/60 mt-2 italic">"我登得越高，看见的便越多。"</p>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          {leftSidebar}
        </div>
      </aside>

      {/* Center: Lectern (Main Content) */}
      <main className="flex-1 relative bg-obsidian flex flex-col h-screen overflow-hidden">
        {/* Cosmic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0b0c15] to-[#000000] opacity-80"></div>
            
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Mystic Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full opacity-20 animate-[spin_120s_linear_infinite] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/10 rounded-full opacity-20 animate-[spin_80s_linear_infinite_reverse] pointer-events-none border-dashed"></div>

            {/* Stars (Simulated with CSS radial gradients for performance) */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIzMDAiIHI9IjEuNSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==')] opacity-30 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNDUwIiBjeT0iNDUwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-20" style={{ animationDuration: '7s' }}></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-16 relative z-10 scrollbar-thin scrollbar-thumb-gold/20">
            {mainContent}
        </div>
      </main>

      {/* Right: Loom (Optional Sidebar/Overlay) */}
      {rightSidebar && (
        <aside className="hidden lg:block w-80 border-l border-gold/30 bg-midnight/30 flex-shrink-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20">
           {rightSidebar}
        </aside>
      )}
    </div>
  );
};
