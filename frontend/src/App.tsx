import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { Catalogue } from './components/Catalogue'
import { Loom } from './components/Loom'
import { BookReader } from './components/BookReader'
import LoreNetworkGraph from './components/LoreNetworkGraph'
import { getAllItems } from './services/dataService'
import { getAspectInfo } from './utils/aspects'
import { getEntityDef } from './utils/textAnalysis'
import { HOUR_PRINCIPLES } from './utils/lore'
import type { Item } from './types'
import { 
  BookOpenIcon, 
  ShareIcon,
  GlobeAltIcon,
  SunIcon,
  FireIcon,
  ScissorsIcon,
  CloudIcon,
  HeartIcon,
  BeakerIcon,
  MoonIcon,
  KeyIcon,
  SparklesIcon,
  ScaleIcon,
  DocumentTextIcon,
  WrenchIcon,
  UserIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const IconMap: Record<string, React.ComponentType<any>> = {
  SunIcon,
  FireIcon,
  ScissorsIcon,
  CloudIcon,
  HeartIcon,
  BeakerIcon,
  MoonIcon,
  KeyIcon,
  BookOpenIcon,
  SparklesIcon,
  ScaleIcon,
  DocumentTextIcon,
  WrenchIcon,
  UserIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  StarIcon,
  RoseIcon: SparklesIcon // Fallback
};

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [viewMode, setViewMode] = useState<'reader' | 'loom' | 'network'>('reader')

  useEffect(() => {
    const allItems = getAllItems()
    setItems(allItems)
  }, [])

  return (
    <Layout variant={viewMode === 'reader' && selectedItem ? 'reader' : 'default'}>
      {/* Slot 1: Catalogue & Navigation */}
      <div className="flex flex-col h-full">
        <div className="flex border-b border-gold/10 mb-2">
          <button
            onClick={() => setViewMode('reader')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${viewMode === 'reader' ? 'text-gold bg-gold/5' : 'text-parchment/40 hover:text-parchment'}`}
            title="阅读模式"
          >
            <BookOpenIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('loom')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${viewMode === 'loom' ? 'text-gold bg-gold/5' : 'text-parchment/40 hover:text-parchment'}`}
            title="织机视图"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('network')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${viewMode === 'network' ? 'text-gold bg-gold/5' : 'text-parchment/40 hover:text-parchment'}`}
            title="知识图谱"
          >
            <GlobeAltIcon className="w-4 h-4" />
          </button>
        </div>
        
        {viewMode === 'reader' ? (
          <Catalogue 
            items={items} 
            onSelect={setSelectedItem} 
            selectedId={selectedItem?.id} 
          />
        ) : (
          <div className="p-4 text-center text-parchment/40 text-xs font-serif italic">
            {viewMode === 'loom' ? '织机视图下，目录暂时隐藏...' : '图谱模式下，目录暂时隐藏...'}
          </div>
        )}
      </div>

      {/* Slot 2: Main Content */}
      {viewMode === 'network' ? (
        <div className="w-full h-full min-h-[80vh]">
          <LoreNetworkGraph />
        </div>
      ) : viewMode === 'loom' ? (
        <Loom 
          items={items} 
          onSelect={(item) => {
            setSelectedItem(item);
            setViewMode('reader'); // Switch back to reader on select
          }}
        />
      ) : selectedItem ? (
        <BookReader 
          readings={selectedItem.readings || []}
          title={selectedItem.name}
          description={selectedItem.description}
          onClose={() => setSelectedItem(null)}
        />
      ) : (
        <div className="max-w-3xl mx-auto text-center mt-20">
          <h2 className="font-display text-4xl text-gold mb-6">欢迎，图书管理员。</h2>
          <p className="text-xl leading-relaxed text-parchment/80">
            群书静默，静候君手。<br/>
            请从左侧目录中选取典籍，开始您的研习。
          </p>
        </div>
      )}

      {/* Slot 3: Fate Loom Sidebar */}
      {viewMode === 'reader' && selectedItem ? (
        <div className="p-6 space-y-8">
          {/* Fate Loom Header */}
          <div className="flex items-center gap-2 text-gold/80 border-b border-gold/20 pb-2 mb-4">
              <SparklesIcon className="w-5 h-5" />
              <h3 className="font-display text-lg tracking-wide">命运织机</h3>
          </div>

          {/* Level 1: Core Aspects */}
          {(() => {
            const principles = Object.entries(selectedItem.aspects)
              .filter(([key]) => {
                 const parts = key.split('.');
                 const id = parts.length > 1 ? parts[1] : key;
                 return ['lantern', 'forge', 'edge', 'winter', 'heart', 'grail', 'moth', 'knock', 'secret_histories', 'sky', 'moon', 'nectar', 'scale', 'rose'].includes(id);
              })
              .map(([key, val]) => ({ key, val, info: getAspectInfo(key) }))
              .sort((a, b) => b.val - a.val);

            if (principles.length === 0) return null;

            return (
              <div className="space-y-3">
                <h4 className="text-gold/50 font-display text-xs uppercase tracking-widest border-l-2 border-gold/30 pl-2">一级关联：核心性相</h4>
                <div className="grid grid-cols-1 gap-2">
                  {principles.map((p) => {
                    const IconComponent = p.info.icon ? IconMap[p.info.icon] : null;
                    return (
                      <div key={p.key} className={`flex items-center justify-between p-2 rounded bg-black/20 border ${p.info.color.replace('text-', 'border-').split(' ')[1] || 'border-gold/10'}`}>
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className={`w-4 h-4 ${p.info.color.split(' ')[0]}`} />}
                          <span className={`text-sm font-display ${p.info.color.split(' ')[0]}`}>{p.info.name}</span>
                        </div>
                        <span className="text-xs font-serif text-parchment/60">等级 {p.val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Level 1: Mentions */}
          {(() => {
             if (!selectedItem.mentions || selectedItem.mentions.length === 0) return null;
             
             const entities = selectedItem.mentions
                .map(m => getEntityDef(m))
                .filter((e): e is NonNullable<typeof e> => !!e);
             
             const uniqueEntities = Array.from(new Set(entities.map(e => e.id)))
                .map(id => entities.find(e => e.id === id)!);

             if (uniqueEntities.length === 0) return null;

             return (
                <div className="space-y-3">
                   <h4 className="text-gold/50 font-display text-xs uppercase tracking-widest border-l-2 border-gold/30 pl-2">一级关联：提及实体</h4>
                   <div className="flex flex-wrap gap-2">
                      {uniqueEntities.map((e) => (
                         <div key={e.id} className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-parchment/10 hover:border-gold/30 transition-colors cursor-help" title={e.type === 'hour' ? '司辰' : '实体'}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }}></div>
                            <span className="text-sm text-parchment/80">{e.name}</span>
                         </div>
                      ))}
                   </div>
                </div>
             );
          })()}

          {/* Level 2: Related Books */}
          {(() => {
            const principles = Object.entries(selectedItem.aspects)
              .filter(([key]) => {
                 const parts = key.split('.');
                 const id = parts.length > 1 ? parts[1] : key;
                 return ['lantern', 'forge', 'edge', 'winter', 'heart', 'grail', 'moth', 'knock', 'secret_histories', 'sky', 'moon', 'nectar', 'scale', 'rose'].includes(id);
              })
              .sort((a, b) => b[1] - a[1]);

            if (principles.length === 0) return null;
            
            const topPrincipleKey = principles[0][0];
            const topPrincipleInfo = getAspectInfo(topPrincipleKey);

            const relatedBooks = items
              .filter(i => i.id !== selectedItem.id && i.aspects[topPrincipleKey])
              .sort((a, b) => (b.aspects[topPrincipleKey] || 0) - (a.aspects[topPrincipleKey] || 0))
              .slice(0, 3);

            if (relatedBooks.length === 0) return null;

            return (
               <div className="space-y-3">
                  <h4 className="text-gold/50 font-display text-xs uppercase tracking-widest border-l-2 border-gold/30 pl-2">二级关联：{topPrincipleInfo.name}共鸣</h4>
                  <div className="space-y-2">
                     {relatedBooks.map(book => (
                        <button 
                          key={book.id}
                          onClick={() => setSelectedItem(book)}
                          className="w-full text-left group flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors"
                        >
                           <BookOpenIcon className="w-4 h-4 text-parchment/40 group-hover:text-gold mt-0.5" />
                           <div>
                              <div className="text-sm text-parchment/80 group-hover:text-gold transition-colors line-clamp-1">{book.name}</div>
                              <div className="text-xs text-parchment/40 italic">
                                 {topPrincipleInfo.name} {book.aspects[topPrincipleKey]}
                              </div>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            );
          })()}

          {/* Level 2: Entity Principles */}
          {(() => {
             if (!selectedItem.mentions) return null;
             
             const entities = selectedItem.mentions
                .map(m => getEntityDef(m))
                .filter((e): e is NonNullable<typeof e> => !!e);
             
             const relatedPrinciples = new Set<string>();
             entities.forEach(e => {
                if (HOUR_PRINCIPLES[e.id]) {
                   HOUR_PRINCIPLES[e.id].forEach(p => relatedPrinciples.add(p));
                }
             });

             if (relatedPrinciples.size === 0) return null;

             return (
                <div className="space-y-3">
                   <h4 className="text-gold/50 font-display text-xs uppercase tracking-widest border-l-2 border-gold/30 pl-2">二级关联：司辰性相</h4>
                   <div className="flex flex-wrap gap-2">
                      {Array.from(relatedPrinciples).map(p => {
                         const info = getAspectInfo(p);
                         const IconComponent = info.icon ? IconMap[info.icon] : null;
                         return (
                            <div key={p} className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${info.color}`}>
                               {IconComponent && <IconComponent className="w-3 h-3" />}
                               <span>{info.name}</span>
                            </div>
                         );
                      })}
                   </div>
                </div>
             );
          })()}
        </div>
      ) : null}
    </Layout>
  )
}

export default App
