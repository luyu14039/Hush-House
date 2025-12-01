import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { Item } from '../types';
import { getAspectInfo } from '../utils/aspects';
import { getEntityDef } from '../utils/textAnalysis';
import { HOUR_PRINCIPLES, ENTITY_CONNECTIONS } from '../utils/lore';

interface LoomProps {
  items: Item[];
  onSelect?: (item: Item) => void;
}

export const Loom: React.FC<LoomProps> = ({ items, onSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Filters & Interaction State
  const [showPrinciples, setShowPrinciples] = useState(true);
  const [showEntities, setShowEntities] = useState(true);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);

  // Prepare Graph Data
  const data = useMemo(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const principleSet = new Set<string>();
    const entitySet = new Set<string>();

    // 1. Create Book Nodes
    items.forEach(item => {
      // We always create book nodes, but we might filter them out later if we want strict filtering
      // For now, let's keep books always, but only link them if the target exists
      
      const bookNode: Node = {
        id: item.id,
        group: 'book',
        name: item.name,
        item: item,
        color: '#e5e7eb' // parchment-ish
      };
      nodes.push(bookNode);

      // Identify Principles from aspects
      if (showPrinciples) {
        // 1. From direct aspects (BoH style)
        Object.entries(item.aspects).forEach(([key, val]) => {
          const info = getAspectInfo(key);
          const isPrinciple = [
            'lantern', 'forge', 'edge', 'winter', 'heart', 'grail', 'moth', 'knock', 'secret_histories',
            'sky', 'moon', 'nectar', 'scale', 'rose'
          ].includes(key.split('.')[1] || key);

          const isPeriod = key.startsWith('period.');

          if ((isPrinciple || isPeriod) && val > 0) {
            // For periods, we keep the full key (e.g. 'period.solar') to match ASPECT_INFO
            // For principles, we strip the prefix (e.g. 'mystery.lantern' -> 'lantern')
            const principleId = isPeriod ? key : (key.split('.')[1] || key);
            principleSet.add(principleId);
            
            links.push({
              source: item.id,
              target: `p-${principleId}`,
              value: val
            });
          }
        });

        // 2. From Reading Results (CS style - Fragments/Lore)
        if (item.results) {
          item.results.forEach(result => {
             const lowerId = result.result_id.toLowerCase();
             // Check for CS Lore pattern: fragment{principle}{suffix}
             if (lowerId.startsWith('fragment')) {
               let principlePart = lowerId.replace('fragment', '');
               
               const knownPrinciples = [
                  'lantern', 'forge', 'edge', 'winter', 'heart', 'grail', 'moth', 'knock', 'secret_histories'
               ];
               
               // Find which principle matches the start of the remaining string
               const match = knownPrinciples.find(p => principlePart.startsWith(p));
               
               if (match) {
                 principleSet.add(match);
                 links.push({
                   source: item.id,
                   target: `p-${match}`,
                   value: result.level || 1
                 });
               }
             }
          });
        }
      }

      // Identify Mentions (Entities)
      if (showEntities && item.mentions) {
        item.mentions.forEach(entityId => {
          entitySet.add(entityId);
          links.push({
            source: item.id,
            target: `e-${entityId}`,
            value: 1
          });
        });
      }
    });

    // 2. Create Principle Nodes
    if (showPrinciples) {
      principleSet.forEach(pId => {
        const info = getAspectInfo(pId);
        nodes.push({
          id: `p-${pId}`,
          group: 'principle',
          name: info.name,
          color: getPrincipleColor(pId)
        });
      });
    }

    // 3. Create Entity Nodes
    if (showEntities) {
      entitySet.forEach(eId => {
        const def = getEntityDef(eId);
        if (def) {
          nodes.push({
            id: `e-${eId}`,
            group: 'entity',
            name: def.name,
            color: def.color,
            entityType: def.type
          });
        }
      });
    }

    // 4. Create Links between Principles and Hours (if both are shown)
    if (showPrinciples && showEntities) {
      entitySet.forEach(eId => {
        const principles = HOUR_PRINCIPLES[eId];
        if (principles) {
          principles.forEach(pId => {
            // Only link if the principle node actually exists in the graph (is relevant)
            if (principleSet.has(pId)) {
              links.push({
                source: `p-${pId}`,
                target: `e-${eId}`,
                value: 2 // Stronger connection
              });
            }
          });
        }
      });
    }

    // 5. Create Links between Same Books (Cross-game)
    const booksByName: Record<string, Item[]> = {};
    items.forEach(item => {
      if (!booksByName[item.name]) {
        booksByName[item.name] = [];
      }
      booksByName[item.name].push(item);
    });

    Object.values(booksByName).forEach(sameBooks => {
      if (sameBooks.length > 1) {
        // Link them in a chain
        for (let i = 0; i < sameBooks.length - 1; i++) {
          links.push({
            source: sameBooks[i].id,
            target: sameBooks[i+1].id,
            value: 3 // Very strong connection
          });
        }
      }
    });

    // 6. Create Links between Entities (Events/Hours)
    if (showEntities) {
      ENTITY_CONNECTIONS.forEach(conn => {
        const sourceId = `e-${conn.source}`;
        const targetId = `e-${conn.target}`;
        
        // Only add link if both nodes exist in the graph
        const sourceExists = nodes.some(n => n.id === sourceId);
        const targetExists = nodes.some(n => n.id === targetId);

        if (sourceExists && targetExists) {
          links.push({
            source: sourceId,
            target: targetId,
            value: conn.type === 'cause' ? 3 : 1 // Cause is strong, related is weak
          });
        }
      });
    }

    return { nodes, links };
  }, [items, showPrinciples, showEntities]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Render Logic
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const { width, height } = dimensions;

    // Zoom behavior
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength((d: any) => (d.group === 'principle' || d.group === 'entity') ? -1000 : -300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => (d.group === 'principle' || d.group === 'entity') ? 60 : 25).iterations(2))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // Links
    const link = g.append("g")
      .attr("stroke", "#a5f3fc") // Cyan-200 for star chart look
      .attr("stroke-opacity", 0.1)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 0.5);

    // Nodes Group
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node Glow (Hubs)
    node.filter((d) => d.group === 'principle' || d.group === 'entity')
      .append("circle")
      .attr("r", 35)
      .attr("fill", (d) => d.color || '#ccc')
      .attr("fill-opacity", 0.15)
      .attr("filter", "blur(8px)");

    // Node Main Circle
    node.append("circle")
      .attr("r", (d) => (d.group === 'principle' || d.group === 'entity') ? 25 : 6)
      .attr("fill", (d) => (d.group === 'principle' || d.group === 'entity') ? (d.color || '#ccc') : '#0f172a') // Dark fill for books
      .attr("stroke", (d) => (d.group === 'principle' || d.group === 'entity') ? '#fff' : (d.color || '#94a3b8'))
      .attr("stroke-width", (d) => (d.group === 'principle' || d.group === 'entity') ? 2 : 1)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "#fbbf24").attr("stroke-width", 3).attr("fill", "#fbbf24");
        d3.select(this.parentNode as Element).select("text").style("opacity", 1);
      })
      .on("mouseout", function(event, d) {
        const isHub = d.group === 'principle' || d.group === 'entity';
        d3.select(this)
            .attr("stroke", isHub ? '#fff' : (d.color || '#94a3b8'))
            .attr("stroke-width", isHub ? 2 : 1)
            .attr("fill", isHub ? (d.color || '#ccc') : '#0f172a');
        
        if (!isHub && focusedNodeId !== d.id) { // Keep label if focused
          d3.select(this.parentNode as Element).select("text").style("opacity", 0);
        }
      })
      .on("click", (event, d) => {
        event.stopPropagation(); // Prevent background click
        if (d.group === 'book' && d.item) {
          setPreviewItem(d.item);
          setFocusedNodeId(d.id);
        } else if (d.group === 'principle' || d.group === 'entity') {
          // Toggle Focus
          setFocusedNodeId(current => current === d.id ? null : d.id);
        }
      });

    // Node Labels
    const labels = node.append("text")
      .text((d) => d.name)
      .attr("x", (d) => (d.group === 'principle' || d.group === 'entity') ? 0 : 10)
      .attr("y", (d) => (d.group === 'principle' || d.group === 'entity') ? 5 : 4)
      .attr("text-anchor", (d) => (d.group === 'principle' || d.group === 'entity') ? "middle" : "start")
      .style("font-size", (d) => (d.group === 'principle' || d.group === 'entity') ? "14px" : "10px")
      .style("font-weight", (d) => (d.group === 'principle' || d.group === 'entity') ? "bold" : "normal")
      .style("fill", (d) => (d.group === 'principle' || d.group === 'entity') ? "#fff" : "#e2e8f0")
      .style("font-family", "'Crimson Text', serif")
      .style("pointer-events", "none")
      .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)")
      .style("opacity", (d) => (d.group === 'principle' || d.group === 'entity') ? 1 : 0);

    // Background Click to Clear Focus
    svg.on("click", () => {
      setFocusedNodeId(null);
    });

    // Apply Focus Styles
    if (focusedNodeId) {
      // Find connected nodes
      const connectedNodeIds = new Set<string>();
      connectedNodeIds.add(focusedNodeId);
      data.links.forEach(l => {
        const sourceId = (l.source as any).id || l.source;
        const targetId = (l.target as any).id || l.target;
        if (sourceId === focusedNodeId) connectedNodeIds.add(targetId);
        if (targetId === focusedNodeId) connectedNodeIds.add(sourceId);
      });

      // Dim unconnected nodes and links
      node.style("opacity", (d) => connectedNodeIds.has(d.id) ? 1 : 0.1);
      link.style("opacity", (d) => {
        const sourceId = (d.source as any).id || d.source;
        const targetId = (d.target as any).id || d.target;
        return (sourceId === focusedNodeId || targetId === focusedNodeId) ? 1 : 0.05;
      });
      
      // Show labels for connected nodes
      labels.style("opacity", (d) => connectedNodeIds.has(d.id) ? 1 : 0);
    } else {
      // Reset styles
      node.style("opacity", 1);
      link.style("opacity", 1);
      labels.style("opacity", (d) => (d.group === 'principle' || d.group === 'entity') ? 1 : 0);
    }

    // Tooltip title
    node.append("title")
      .text((d) => d.name);

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, onSelect, focusedNodeId]); // Re-run when focus changes

  return (
    <div ref={containerRef} className="w-full h-full bg-transparent relative overflow-hidden">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block" />
      
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 glass-panel p-3 rounded backdrop-blur-sm">
        <h3 className="text-gold font-display text-sm mb-2">织机控制</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-parchment/80 text-xs cursor-pointer hover:text-parchment">
            <input 
              type="checkbox" 
              checked={showPrinciples} 
              onChange={(e) => setShowPrinciples(e.target.checked)}
              className="accent-gold bg-transparent border-gold/30 rounded-sm"
            />
            显示性相 (Principles)
          </label>
          <label className="flex items-center gap-2 text-parchment/80 text-xs cursor-pointer hover:text-parchment">
            <input 
              type="checkbox" 
              checked={showEntities} 
              onChange={(e) => setShowEntities(e.target.checked)}
              className="accent-gold bg-transparent border-gold/30 rounded-sm"
            />
            显示语义关联 (Entities)
          </label>
        </div>
        {focusedNodeId && (
          <div className="mt-3 pt-2 border-t border-gold/10">
            <button 
              onClick={() => setFocusedNodeId(null)}
              className="text-xs text-gold hover:underline w-full text-left"
            >
              清除聚焦 (Clear Focus)
            </button>
          </div>
        )}
      </div>

      {/* Legend / Info Overlay */}
      <div className="absolute bottom-4 right-4 glass-panel p-2 rounded text-xs text-parchment/40 font-mono pointer-events-none">
        <div>节点: {data.nodes.length}</div>
        <div>连接: {data.links.length}</div>
        <div className="mt-1 text-[10px] italic">拖动节点以整理 • 滚轮缩放</div>
      </div>

      {/* Book Preview Modal */}
      {previewItem && (
        <div className="absolute top-4 right-4 w-80 glass-panel rounded shadow-2xl p-4 animate-fade-in backdrop-blur-md z-50">
          <div className="flex justify-between items-start mb-4 border-b border-gold/20 pb-2">
            <h3 className="text-gold font-display text-lg leading-tight">{previewItem.name}</h3>
            <button 
              onClick={() => {
                setPreviewItem(null);
                setFocusedNodeId(null);
              }}
              className="text-parchment/40 hover:text-gold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="text-parchment/80 text-sm font-serif italic mb-4 line-clamp-4" dangerouslySetInnerHTML={{ __html: previewItem.description }} />
          
          {/* Mini Aspects */}
          <div className="flex flex-wrap gap-1 mb-6">
            {Object.entries(previewItem.aspects).slice(0, 5).map(([key, val]) => {
               const info = getAspectInfo(key);
               return (
                 <span key={key} className={`text-[10px] px-1.5 py-0.5 rounded border ${info.color}`}>
                   {info.name} {val}
                 </span>
               )
            })}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (onSelect) onSelect(previewItem);
              }}
              className="flex-1 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 py-2 px-4 rounded font-display text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              阅读典籍
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to map principle IDs to hex colors (Tailwind classes are hard to use in D3)
function getPrincipleColor(id: string): string {
  const map: Record<string, string> = {
    lantern: '#facc15', // yellow-400
    forge: '#f97316', // orange-500
    edge: '#84cc16', // lime-500
    winter: '#cffafe', // cyan-100
    heart: '#fb7185', // rose-400
    grail: '#dc2626', // red-600
    moth: '#fde68a', // amber-200
    knock: '#a855f7', // purple-500
    secret_histories: '#e879f9', // fuchsia-400
    sky: '#38bdf8', // sky-400
    moon: '#a5b4fc', // indigo-300
    nectar: '#34d399', // emerald-400
    scale: '#a16207', // yellow-700
    rose: '#f472b6', // pink-400
    // Periods
    'period.dawn': '#fdba74', // orange-300
    'period.solar': '#eab308', // yellow-500
    'period.noon': '#ca8a04', // yellow-600
    'period.dusk': '#c2410c', // orange-700
    'period.night': '#312e81', // indigo-900
    'period.curia': '#c084fc', // purple-400
    'period.nocturnal': '#3730a3', // indigo-800
    'period.baronial': '#991b1b', // red-800
  };
  return map[id] || '#d4af37'; // Default gold
}

