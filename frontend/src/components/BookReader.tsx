import React, { forwardRef, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { BookOpenIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Reading {
  intro?: string;
  content?: string;
}

interface BookReaderProps {
  readings: Reading[];
  title: string;
  description: string;
  onClose?: () => void;
}

// Page Component
const Page = forwardRef<HTMLDivElement, React.PropsWithChildren<{ number: number; className?: string; isLeft?: boolean; isActive?: boolean }>>((props, ref) => {
  return (
    <div className={`demoPage bg-[#fdfbf7] text-[#292524] h-full overflow-hidden ${props.className}`} ref={ref}>
      <div className="h-full w-full p-8 md:p-12 flex flex-col relative">
        {/* Paper Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-60 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply"></div>
        
        {/* Spine Shadow */}
        <div className={`absolute inset-y-0 ${props.isLeft ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent w-8 pointer-events-none`}></div>
        
        {/* Content Container */}
        <div className={`relative z-10 h-full flex flex-col ${props.isActive ? 'animate-mystic-emerge' : 'opacity-0'}`}>
          {props.children}
          
          {/* Page Number */}
          {props.number > 0 && (
            <div className="mt-auto pt-4 text-center text-[#292524]/40 text-xs font-serif italic">
              - {props.number} -
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'Page';

// Cover Component
const Cover = forwardRef<HTMLDivElement, React.PropsWithChildren<{ title: string; className?: string; isBack?: boolean }>>((props, ref) => {
  return (
    <div className={`demoPage bg-[#2d1b18] text-[#d4af37] h-full shadow-2xl overflow-hidden ${props.className}`} ref={ref}>
      <div className={`h-full w-full p-8 flex flex-col items-center justify-center relative border-4 border-[#d4af37]/20 m-1 rounded-sm ${props.isBack ? 'border-l-8' : 'border-r-8'}`}>
        {/* Leather Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay"></div>
        
        <div className="relative z-10 text-center space-y-8">
          {!props.isBack && (
            <>
              <BookOpenIcon className="w-20 h-20 mx-auto opacity-80 text-[#d4af37]" />
              <h1 className="font-display text-3xl md:text-5xl tracking-wider leading-tight drop-shadow-lg line-clamp-4 text-[#d4af37]">
                {props.title}
              </h1>
              <div className="w-16 h-1 bg-[#d4af37]/50 mx-auto rounded-full"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

Cover.displayName = 'Cover';

export const BookReader: React.FC<BookReaderProps> = ({ readings, title, description, onClose }) => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [mode, setMode] = useState<'immersive' | 'minimalist'>('minimalist');
  const [showMysticDetails, setShowMysticDetails] = useState(true);

  // --- Minimalist Mode Render ---
  if (mode === 'minimalist') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#1c1917] p-4 md:p-8">
        {/* Ambient Background Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none"></div>

        {/* Paper Container */}
        <div className="w-full max-w-2xl h-full relative bg-[#fdfbf7] text-[#292524] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden flex flex-col border border-[#e5e5e5]">
           
           {/* Bookmark: Switch Mode */}
           <button 
             onClick={() => setMode('immersive')}
             className="absolute -top-2 left-8 z-30 bg-[#7f1d1d] text-[#fef3c7] px-3 pt-4 pb-3 rounded-b-sm shadow-md hover:h-14 transition-all duration-300 flex flex-col items-center gap-1 group border-x border-b border-[#450a0a]/20"
             title="切换至沉浸模式"
           >
             <BookOpenIcon className="w-5 h-5 drop-shadow-sm" />
             <span className="text-[10px] font-serif tracking-widest opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-2 bg-[#292524] text-[#eaddcf] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">沉浸模式</span>
           </button>

           {/* Toggle Mystic Details */}
           <button 
             onClick={() => setShowMysticDetails(!showMysticDetails)}
             className={`absolute top-6 right-20 z-30 transition-colors duration-300 ${showMysticDetails ? 'text-[#7f1d1d]' : 'text-[#292524]/20 hover:text-[#7f1d1d]'}`}
             title={showMysticDetails ? "隐藏神秘痕迹" : "显示神秘痕迹"}
           >
             <SparklesIcon className="w-6 h-6" />
           </button>

           {/* Close Button (Ink Style) */}
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 z-30 text-[#292524]/20 hover:text-[#7f1d1d] transition-colors duration-300 hover:rotate-90 transform"
             title="关闭书籍"
           >
             <XMarkIcon className="w-8 h-8" />
           </button>

           {/* Paper Texture & Lighting Overlay */}
           <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,transparent_60%)] mix-blend-soft-light"></div>
              {/* Inner Border simulating press/indentation */}
              <div className="absolute inset-0 border-[3px] border-[#292524]/5 m-1 rounded-sm pointer-events-none"></div>
              
              {/* Mystic Details (Coffee Stains & Runes) */}
              {showMysticDetails && (
                <>
                  {/* Coffee Stain Bottom Right */}
                  <div className="absolute bottom-12 -right-12 w-64 h-64 opacity-[0.08] mix-blend-multiply pointer-events-none rotate-12 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] rounded-full blur-[1px]"></div>
                  <div className="absolute bottom-16 -right-8 w-48 h-48 border-[12px] border-[#3e2723] opacity-[0.05] rounded-full mix-blend-multiply pointer-events-none blur-[2px]"></div>
                  
                  {/* Ink Splatter Top Left */}
                  <div className="absolute top-24 left-12 w-32 h-32 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] rotate-45"></div>

                  {/* Mystic Runes (Randomly placed) */}
                  <div className="absolute bottom-8 left-8 font-display text-4xl text-[#7f1d1d] opacity-[0.08] rotate-[-15deg] pointer-events-none select-none">
                    ☥ ☾ 🜃
                  </div>
                  <div className="absolute top-1/2 right-4 font-display text-2xl text-[#292524] opacity-[0.05] rotate-[90deg] pointer-events-none select-none tracking-[1em]">
                    NOX
                  </div>
                </>
              )}
           </div>
           
           {/* Scrollable Content Area */}
           <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-12 md:p-16 scroll-smooth">
              
              {/* Header */}
              <div key={`header-${title}`} className="text-center mb-12 animate-mystic-emerge" style={{ animationDelay: '100ms' }}>
                <div className="text-[#d4af37] opacity-60 mb-4 flex justify-center">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl text-[#292524] mb-6 tracking-wide drop-shadow-sm mix-blend-multiply">{title}</h1>
                <div className="flex items-center justify-center gap-4 opacity-40">
                  <div className="h-px w-12 bg-[#292524]"></div>
                  <div className="w-2 h-2 rotate-45 border border-[#292524]"></div>
                  <div className="h-px w-12 bg-[#292524]"></div>
                </div>
              </div>

              {/* Description */}
              <div key={`desc-${title}`} className="prose prose-stone max-w-none mb-16 animate-mystic-emerge" style={{ animationDelay: '300ms' }}>
                <div 
                  className="text-lg leading-loose font-serif italic text-justify text-[#292524]/80 first-letter:text-3xl first-letter:font-display first-letter:mr-1 mix-blend-multiply"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>

              {/* Readings */}
              <div className="space-y-16">
                {readings.map((reading, idx) => (
                  <div key={`${title}-reading-${idx}`} className="space-y-6 relative animate-mystic-emerge" style={{ animationDelay: `${500 + idx * 200}ms` }}>
                    {/* Decorative Divider for subsequent readings */}
                    {idx > 0 && (
                      <div className="flex justify-center my-12 opacity-20">
                         <div className="w-24 h-px bg-[#292524]"></div>
                      </div>
                    )}

                    {reading.intro && (
                      <div className="pl-6 border-l-2 border-[#d4af37]/40 relative group hover:border-[#d4af37] transition-colors duration-500">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#d4af37] group-hover:scale-125 transition-transform duration-300"></div>
                        <h4 className="text-[#d4af37] font-display text-xs uppercase tracking-[0.2em] mb-3 opacity-80 group-hover:opacity-100 transition-opacity mix-blend-multiply">正在阅读……</h4>
                        <div className="text-base italic text-[#292524]/60 leading-relaxed group-hover:text-[#292524]/80 transition-colors duration-500 mix-blend-multiply" dangerouslySetInnerHTML={{ __html: reading.intro }} />
                      </div>
                    )}
                    
                    {reading.content && (
                      <div className="mt-8">
                        <h4 className="text-[#d4af37] font-display text-xs uppercase tracking-[0.2em] mb-3 opacity-80 mix-blend-multiply">我读到……</h4>
                        <div 
                          className="text-xl leading-[2.0] font-serif text-[#292524] first-letter:text-5xl first-letter:font-display first-letter:text-[#d4af37] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] selection:bg-[#d4af37]/20 mix-blend-multiply"
                          dangerouslySetInnerHTML={{ __html: reading.content }} 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-20 pb-8 text-[#292524]/20 text-sm font-serif italic flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: `${800 + readings.length * 200}ms` }}>
                <div className="w-16 h-px bg-[#292524]/20"></div>
                <span>Finis</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- Immersive Mode Logic ---

  // Prepare pages content
  const pages = [];
  
  // 1. Front Cover (Page 0) - Right side
  // Already handled by <Cover /> as first child

  // 2. Spread 1 Left: Description (Page 1)
  pages.push(
    <div key="intro" className="prose prose-sm prose-p:text-[#292524] prose-headings:text-[#292524]/80 max-w-none h-full flex flex-col relative">
      {/* Decorative Corner */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#d4af37]/20 rounded-tl-lg pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#d4af37]/20 rounded-br-lg pointer-events-none"></div>

      <h3 className="text-[#292524]/50 font-display text-xs uppercase tracking-widest mb-6 text-center border-b border-[#292524]/10 pb-2 mt-8">
        序言
      </h3>
      <div 
        className="text-base leading-relaxed font-serif italic text-justify flex-1 overflow-y-auto custom-scrollbar pr-2"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="mt-auto pt-4 text-center text-[#292524]/20 text-xs">
        Hush House Library
      </div>
    </div>
  );

  // 3. Spread 1 Right: First Reading (Page 2)
  // And subsequent readings...
  readings.forEach((reading, idx) => {
    // Combine Intro and Content into one page if possible, or split if needed.
    // User requested: "Right side is 'Reading' and 'Read'".
    // We'll put both on one page for the first reading to match the "Spread 1 Right" request.
    
    pages.push(
      <div key={`reading-${idx}`} className="h-full flex flex-col overflow-y-auto custom-scrollbar pr-2 relative">
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]/20 rounded-tr-lg pointer-events-none"></div>
        
        {reading.intro && (
          <div className="mb-6 mt-4">
             <h4 className="text-[#292524]/50 font-display text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              正在阅读……
            </h4>
            <div 
              className="text-sm text-[#292524]/90 italic leading-relaxed border-l-2 border-[#d4af37]/30 pl-3"
              dangerouslySetInnerHTML={{ __html: reading.intro }}
            />
          </div>
        )}
        
        {reading.content && (
          <div className="flex-1">
            <h4 className="text-[#292524]/50 font-display text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              我读到……
            </h4>
            <div 
              className="text-base leading-loose font-serif text-[#292524] first-letter:text-3xl first-letter:font-display first-letter:text-[#d4af37] first-letter:mr-1 first-letter:float-left"
              dangerouslySetInnerHTML={{ __html: reading.content }}
            />
          </div>
        )}
      </div>
    );
  });

  // Ensure even number of pages for correct back cover placement
  // Current structure:
  // Child 0: Cover (Right)
  // Child 1: Description (Left)
  // Child 2: Reading 1 (Right)
  // Child 3: Reading 2 (Left) ...
  // We want the Back Cover to be on the Left (closing the book) or just at the end.
  // If total children (Cover + Pages) is Odd, the last one is on the Right.
  // If Even, the last one is on the Left.
  // We want the Back Cover to be the last element.
  
  // Let's just add filler if needed to ensure the Back Cover is on an appropriate side or just let it be.
  // Actually, HTMLFlipBook handles it.
  
  const bookWidth = 450;
  const bookHeight = 650;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative perspective-2000 bg-[#1a120b] overflow-hidden group">
      {/* Desk Texture Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#1a120b]"></div>
        {/* Wood Texture */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay"></div>
        {/* Tablecloth / Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-lozenge.png')] mix-blend-soft-light"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90"></div>
      </div>

      {/* Close Button (Immersive) */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-[#292524] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]/60 hover:text-[#d4af37] hover:scale-110 transition-all duration-300 group/close"
        title="关闭书籍"
      >
        <div className="absolute inset-0 rounded-full border border-[#d4af37]/10 scale-75 group-hover/close:scale-90 transition-transform"></div>
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Mode Toggle (Immersive) */}
      <button 
        onClick={() => setMode('minimalist')}
        className="absolute top-0 left-12 z-50 bg-[#292524] text-[#d4af37]/80 px-3 pt-4 pb-3 rounded-b shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-x border-b border-[#d4af37]/10 hover:h-16 transition-all duration-300 flex flex-col items-center gap-1 group/toggle"
      >
        <DocumentTextIcon className="w-5 h-5" />
        <span className="text-[10px] font-serif tracking-widest opacity-0 group-hover/toggle:opacity-100 transition-opacity absolute top-full mt-2 bg-[#1a120b] text-[#d4af37] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none border border-[#d4af37]/20">简约模式</span>
      </button>

      {/* Book Container */}
      <div className={`relative z-10 transition-all duration-700 ease-out origin-center ${currentPage === 0 ? '-translate-x-[25%]' : 'translate-x-0'} scale-[0.6] md:scale-[0.75] lg:scale-[0.85] xl:scale-100`}>
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={bookWidth}
          height={bookHeight}
          size="fixed"
          minWidth={300}
          maxWidth={500}
          minHeight={400}
          maxHeight={700}
          showCover={true}
          mobileScrollSupport={true}
          className="book-flip shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]"
          ref={bookRef}
          flippingTime={1000}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          onFlip={(e: any) => setCurrentPage(e.data)}
        >
          {/* Front Cover (Page 0) */}
          <Cover title={title} />

          {/* Pages */}
          {pages.map((content, index) => {
            const pageNum = index + 1;
            // Check if page is currently visible (active)
            const isActive = (pageNum === currentPage) || (pageNum === currentPage + 1);
            
            return (
              <Page 
                key={index} 
                number={pageNum} 
                isLeft={index % 2 === 0}
                isActive={isActive}
              > 
                {content}
              </Page>
            );
          })}

          {/* Back Cover */}
          <Cover title="" isBack={true} />
        </HTMLFlipBook>
      </div>

      {/* Navigation Controls (Bottom) */}
      <div className="absolute bottom-8 flex items-center gap-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="p-3 rounded-full bg-[#292524]/80 text-[#d4af37]/60 hover:text-[#d4af37] hover:bg-[#292524] backdrop-blur-sm border border-[#d4af37]/10 transition-all shadow-lg hover:scale-110"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        
        <span className="text-[#d4af37]/40 font-serif italic text-sm tracking-widest">
          {currentPage === 0 ? '封面' : `第 ${currentPage} 页`}
        </span>

        <button 
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="p-3 rounded-full bg-black/40 text-parchment/60 hover:text-gold hover:bg-black/60 backdrop-blur-sm border border-white/5 transition-all"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

