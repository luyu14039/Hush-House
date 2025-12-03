import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import graphData from '../data/lore_graph.json';

// Define types for our graph data
interface Node {
  id: string;
  label: string;
  type: string;
  color: string;
  val: number;
  data?: {
    aliases?: string[];
    origin?: string;
    factions?: string[];
    description?: string;
    mentions?: { id: string; name: string }[];
  };
  x?: number;
  y?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  label: string;
  weight: number;
  confidence: number;
  descriptions: string[];
}

// Theme Palette - Neon/Star Chart Style
const THEME = {
  hour: '#fbbf24', // Amber-400 (Bright Gold)
  faction: '#facc15', // Yellow-400
  location: '#22d3ee', // Cyan-400
  book: '#a78bfa', // Violet-400
  event: '#f87171', // Red-400
  person: '#94a3b8', // Slate-400
  default: '#64748b', // Slate-500
  background: '#000000', // Transparent/Black
  highlight: '#38bdf8', // Sky-400
  selection: '#f472b6', // Pink-400
};

// Relationship Translations
const RELATIONSHIP_TRANSLATIONS: Record<string, string> = {
  "ASSOCIATED_WITH": "相关",
  "LOCATED_IN": "位于",
  "KILLED": "杀害",
  "CREATED": "创造",
  "OPPOSED_TO": "敌对",
  "SERVED_BY": "侍奉",
  "ALLIED_WITH": "结盟",
  "LOVED": "爱慕",
  "BETRAYED": "背叛",
  "DESCENDANT_OF": "后裔",
  "PARENT_OF": "父母",
  "CHILD_OF": "子女",
  "MEMBER_OF": "成员",
  "LED_BY": "领导",
  "STUDIED_BY": "研究",
  "ASPECT_OF": "侧面",
  "BELONGS_TO": "属于",
  "MENTIONED_IN": "提及",
  "LOCATED_AT": "位于",
  "AUTHOR_OF": "著有",
  "RELATED_TO": "相关",
  "CONTAINS": "包含",
  "MASTER_OF": "主宰",
  "APPEARS_IN": "出场",
  "PART_OF": "属于",
  "KNOWS": "认识",
  "ENEMY_OF": "敌对",
  "ALLY_OF": "盟友",
  "MENTIONED": "提及",
  "LOCATED": "位于",
  "AUTHOR": "作者",
  // New translations
  "SERVES": "侍奉",
  "ASSISTED": "协助",
  "SIBLING_OF": "手足",
  "USED_GATE": "使用门扉",
  "WORSHIPS": "崇拜",
  "REQUESTED_HELP_FROM": "求助",
  "BLESSED_BY": "受祝",
  "ASCENDED_TO": "飞升至",
  "OPENED_PATH_TO": "开启通路",
  "STUDIED_UNDER": "师从",
  "USES": "使用",
  "BORN_FROM": "诞生于",
  "CURSED": "诅咒",
  "PUNISHED": "惩罚",
  "MEETS_AT": "聚会于",
  "SUCCESSOR_OF": "继任",
  "VISITED": "访问",
  "WILL_VISIT": "将访",
  "ROMANTICALLY_INVOLVED_WITH": "恋人",
  "ABOUT": "关于",
  "AUTHORED_BY": "作者",
  "TRANSCRIBED_BY": "抄录",
  "OWNED_BY": "持有",
  "ACQUIRED_FROM": "获取自",
  "DISCOVERED_BY": "发现者",
  "CLAIMED_OWNER_OF": "声称拥有",
  "STOLE": "偷窃",
  "CONSUMED": "吞噬",
  "FOUND": "发现",
  "FOUND_AT": "发现于",
  "COMPILED_BY": "编纂",
  "RESTORED_BY": "修复",
  "INFLUENCED_BY": "受影响",
  "ILLUSTRATED_BY": "绘图",
  "BASED_ON": "基于",
  "INSPIRED_BY": "灵感",
  "DERIVED_FROM": "源自",
  "MENTIONS": "提及",
  "COMMISSIONED_BY": "委托",
  "BURIED_WITH": "合葬",
  "LEADER_OF": "领导",
  "IMPRISONED_BY": "囚禁者",
  "DESCRIBED": "描述",
  "LEARNED_FROM": "习自",
  "WORSHIPPED": "崇拜",
  "ENCOUNTERED": "遭遇",
  "IMPRISONED": "囚禁",
  "RESIDED_AT": "居住于",
  "SERVED": "侍奉",
  "DONATED_TO": "捐赠",
  "MANIFESTATION_OF": "显现",
  "CONTACTED": "联系",
  "RESIDES_IN": "居住于",
  "BUILT": "建造",
  "DEDICATED_TO": "献给",
  "ENGAGED_TO": "订婚",
  "PROTECTED_BY": "保护",
  "IMPRISONED_AT": "囚禁于",
  "DISCOVERED": "发现",
  "HID_AT": "藏身于",
  "ADOPTED": "收养",
  "ADVOCATES_FOR": "倡导",
  "PREDECESSOR_OF": "前身"
};

const translateLabel = (label: string) => {
  if (!label) return "";
  const key = label.toUpperCase().replace(/\s+/g, '_');
  if (RELATIONSHIP_TRANSLATIONS[key]) return RELATIONSHIP_TRANSLATIONS[key];
  for (const k in RELATIONSHIP_TRANSLATIONS) {
      if (key.includes(k)) return RELATIONSHIP_TRANSLATIONS[k];
  }
  return label;
};

// Helper to get color
const getNodeColor = (node: Node) => {
    if (node.type === 'hour' && node.color && node.color !== '#999') return node.color;
    // Map types to theme
    switch (node.type) {
        case 'faction': return THEME.faction;
        case 'location': return THEME.location;
        case 'book': return THEME.book;
        case 'event': return THEME.event;
        case 'person': return THEME.person;
        default: return THEME.default;
    }
};

const LoreNetworkGraph: React.FC = () => {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<Link>());
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [relatedNodes, setRelatedNodes] = useState(new Set<string>());
  const [relatedLinks, setRelatedLinks] = useState(new Set<Link>());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAmbientMotion, setIsAmbientMotion] = useState(true); // Default On for Galaxy
  const [isResearchMode, setIsResearchMode] = useState(false); // Default Off (Galaxy Mode)
  const [alphaDecay, setAlphaDecay] = useState(0.0228);
  const [velocityDecay, setVelocityDecay] = useState(0.4);
  
  // Refs for force engine to access latest state without re-binding
  const isAmbientMotionRef = useRef(isAmbientMotion);
  const isResearchModeRef = useRef(isResearchMode);
  const selectedNodeRef = useRef(selectedNode);
  const selectedLinkRef = useRef(selectedLink);

  useEffect(() => { 
      isAmbientMotionRef.current = isAmbientMotion;
      if (!isAmbientMotion) {
          setAlphaDecay(0.0228);
          setVelocityDecay(0.4);
      } else {
          if (graphRef.current) graphRef.current.d3ReheatSimulation();
      }
  }, [isAmbientMotion]);

  useEffect(() => {
      isResearchModeRef.current = isResearchMode;
      if (graphRef.current) graphRef.current.d3ReheatSimulation();
  }, [isResearchMode]);

  useEffect(() => { selectedNodeRef.current = selectedNode; }, [selectedNode]);
  useEffect(() => { selectedLinkRef.current = selectedLink; }, [selectedLink]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Memoize data to prevent unnecessary re-renders
  const data = useMemo(() => {
    // Clone to avoid mutation issues with the library
    return JSON.parse(JSON.stringify(graphData));
  }, []);

  // Main Physics Engine Configuration
  useEffect(() => {
    if (!graphRef.current) return;

    const fg = graphRef.current;

    // 1. Link Force: Dynamic Rigidity
    // We use a timeout to ensure the d3 link force is initialized
    setTimeout(() => {
        if (!fg.d3Force('link')) return;
        
        fg.d3Force('link').strength((link: any) => {
            // Research Mode: Strong, structural connections
            if (isResearchModeRef.current) {
                return 0.3; 
            }

            // Galaxy Mode: Loose connections
            if (selectedNode || selectedLink) {
                const isRelated = relatedLinks.has(link) || link === selectedLink;
                // Strong pull for related links to bring them close
                // Weak pull for others to maintain some structure but allow focus
                return isRelated ? 0.5 : 0.01; 
            }
            // Default "Galaxy" mode: Very loose connections
            // Enough to keep topology roughly correct, but loose enough to float like a cloud
            return 0.01; 
        });
    }, 10);

    // 2. Charge: Repulsion
    fg.d3Force('charge').strength((node: any) => {
        // Research Mode: Strong repulsion for clear layout
        if (isResearchModeRef.current) return -120;

        // Galaxy Mode: Softer repulsion
        // Selected node pushes others away a bit more to clear space
        if (selectedNode && node.id === selectedNode.id) return -100;
        return -30; 
    });

    // 3. Custom Galaxy Force (Gravity + Drift)
    fg.d3Force('galaxy_physics', (alpha: number) => {
        const k = alpha;
        
        data.nodes.forEach((node: any) => {
            if (!node.x || !node.y) return;
            
            // Research Mode: Simple centering, no drift
            if (isResearchModeRef.current) {
                 const distSq = node.x * node.x + node.y * node.y;
                 const dist = Math.sqrt(distSq);
                 // Stronger centering to keep graph compact
                 const gravityStrength = dist > 500 ? 0.05 : 0.01;
                 node.vx -= node.x * gravityStrength * k;
                 node.vy -= node.y * gravityStrength * k;
                 return;
            }

            const distSq = node.x * node.x + node.y * node.y;
            const dist = Math.sqrt(distSq);

            // A. Central Gravity (Prevent infinite drift)
            // Soft pull towards center, stronger at edges to keep the "Galaxy" contained
            // This fixes the "infinite drift" issue
            const gravityStrength = dist > 300 ? 0.02 : 0.005;
            node.vx -= node.x * gravityStrength * k;
            node.vy -= node.y * gravityStrength * k;

            // B. Ambient Drift (The "Sway")
            if (isAmbientMotionRef.current) {
                // 1. Gentle Rotation (Galaxy Spin)
                // Adds a subtle "Galaxy" feel
                const spinSpeed = 0.05;
                if (dist > 10) {
                    node.vx += (-node.y / dist) * spinSpeed * k;
                    node.vy += (node.x / dist) * spinSpeed * k;
                }

                // 2. Random Noise (Star Twinkle/Drift)
                // Independent movement for each node
                const time = Date.now() / 3000;
                const idVal = node.id.charCodeAt(0);
                const noiseX = Math.sin(time + idVal) * 0.3;
                const noiseY = Math.cos(time + idVal * 1.1) * 0.3;
                
                node.vx += noiseX * k;
                node.vy += noiseY * k;
            }
        });
    });

    // Remove old forces if they exist to avoid conflicts
    fg.d3Force('center', null);
    fg.d3Force('rotation', null);
    fg.d3Force('ambient', null);

    fg.d3ReheatSimulation();

  }, [selectedNode, selectedLink, relatedLinks, isAmbientMotion, isResearchMode, data]);

  // Update related nodes when selection changes
  useEffect(() => {
    if (selectedLink) {
        const sourceId = typeof selectedLink.source === 'object' ? (selectedLink.source as Node).id : selectedLink.source;
        const targetId = typeof selectedLink.target === 'object' ? (selectedLink.target as Node).id : selectedLink.target;
        
        const newRelatedNodes = new Set<string>();
        newRelatedNodes.add(sourceId);
        newRelatedNodes.add(targetId);
        setRelatedNodes(newRelatedNodes);

        const newRelatedLinks = new Set<Link>();
        newRelatedLinks.add(selectedLink);
        setRelatedLinks(newRelatedLinks);
    } else if (selectedNode) {
      const newRelatedNodes = new Set<string>();
      const newRelatedLinks = new Set<Link>();
      newRelatedNodes.add(selectedNode.id);
      
      data.links.forEach((link: Link) => {
        const sourceId = typeof link.source === 'object' ? (link.source as Node).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as Node).id : link.target;

        if (sourceId === selectedNode.id || targetId === selectedNode.id) {
          newRelatedLinks.add(link);
          newRelatedNodes.add(sourceId);
          newRelatedNodes.add(targetId);
        }
      });
      setRelatedNodes(newRelatedNodes);
      setRelatedLinks(newRelatedLinks);
    } else {
      setRelatedNodes(new Set());
      setRelatedLinks(new Set());
    }
  }, [selectedNode, selectedLink, data]);

  const handleNodeHover = (node: Node | null) => {
    setHoverNode(node);
    const newHighlightNodes = new Set<string>();
    const newHighlightLinks = new Set<Link>();

    if (node) {
      newHighlightNodes.add(node.id);
      data.links.forEach((link: Link) => {
        const sourceId = typeof link.source === 'object' ? (link.source as Node).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as Node).id : link.target;

        if (sourceId === node.id || targetId === node.id) {
          newHighlightLinks.add(link);
          newHighlightNodes.add(sourceId);
          newHighlightNodes.add(targetId);
        }
      });
    }

    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  };

  const handleNodeClick = useCallback((node: Node) => {
    // Helper to zoom to a node
    const zoomToNode = (n: Node) => {
        if (graphRef.current) {
            graphRef.current.centerAt(n.x, n.y, 1000);
            graphRef.current.zoom(4, 2000);
        }
    };

    // Helper to zoom to a link
    const zoomToLink = (link: Link) => {
        const getNode = (item: string | Node) => {
            if (typeof item === 'object') {
                const n = item as Node;
                if (typeof n.x === 'number') return n;
                return data.nodes.find((gn: Node) => gn.id === n.id) || n;
            }
            return data.nodes.find((gn: Node) => gn.id === item);
        };

        const source = getNode(link.source);
        const target = getNode(link.target);

        if (source && target && typeof source.x === 'number' && typeof target.x === 'number') {
             const midX = (source.x + target.x) / 2;
             const midY = (source.y + target.y) / 2;
             const dx = target.x - source.x;
             const dy = target.y - source.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             const safeDist = Math.max(dist, 1);
             const targetZoom = Math.min(6, Math.max(1, 400 / safeDist));
             
             if (graphRef.current) {
                 console.log("Zooming to link:", { midX, midY, targetZoom });
                 graphRef.current.centerAt(midX, midY, 1000);
                 graphRef.current.zoom(targetZoom, 2000);
             }
        } else {
            console.warn("Could not zoom to link, missing coordinates", { source, target });
        }
    };

    if (selectedLink) {
        // If in Link Mode, clicking any node switches to that node
        setSelectedLink(null);
        setSelectedNode(node);
        zoomToNode(node);
        return;
    }

    if (selectedNode) {
        if (selectedNode.id === node.id) {
            // Clicked same node, just re-center
            zoomToNode(node);
            return;
        }

        // Check if connected
        const link = data.links.find((l: Link) => {
            const s = typeof l.source === 'object' ? (l.source as Node).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as Node).id : l.target;
            return (s === selectedNode.id && t === node.id) || (s === node.id && t === selectedNode.id);
        });

        if (link) {
            // Connected -> Switch to Link Mode
            setSelectedNode(null);
            setSelectedLink(link);
            zoomToLink(link);
        } else {
            // Not connected -> Switch to new node
            setSelectedNode(node);
            zoomToNode(node);
        }
    } else {
        // Nothing selected -> Select node
        setSelectedNode(node);
        zoomToNode(node);
    }
  }, [selectedNode, selectedLink, data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term && graphRef.current) {
      const foundNode = data.nodes.find((n: Node) => 
        n.label.toLowerCase().includes(term.toLowerCase()) || 
        n.id.toLowerCase().includes(term.toLowerCase())
      );
      
      if (foundNode) {
        // Just highlight/select the first match for now
        setSelectedNode(foundNode);
        graphRef.current.centerAt(foundNode.x, foundNode.y, 1000);
        graphRef.current.zoom(4, 2000);
      }
    }
  };

  // Helper to format labels (remove person. prefix, capitalize, etc.)
  const formatLabel = (node: Node) => {
    // If label is already good (Chinese or normal text), use it
    // Simple check: if it has no dots and no underscores, it's probably fine
    // Or if it contains Chinese characters
    if (/[\u4e00-\u9fa5]/.test(node.label)) return node.label;
    if (!node.label.includes('.') && !node.label.includes('_')) return node.label;

    // Fallback: format the ID or raw label
    const text = node.label || node.id;
    return text.split('.')
      .pop() // Get last part (e.g. 'arthur_cousins')
      ?.split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || text;
  };

  const paintNode = useCallback((node: Node, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = formatLabel(node);
    const isSelected = node === selectedNode;
    
    // Check if related via set OR directly via selectedLink (fallback)
    const isRelated = relatedNodes.has(node.id) || 
        (!!selectedLink && (
            (typeof selectedLink.source === 'object' ? (selectedLink.source as Node).id : selectedLink.source) === node.id ||
            (typeof selectedLink.target === 'object' ? (selectedLink.target as Node).id : selectedLink.target) === node.id
        ));

    const isHovered = node === hoverNode;
    const isHighlighted = highlightNodes.has(node.id);
    
    // Determine opacity based on focus mode
    let opacity = 1;
    if (selectedNode || selectedLink) {
        if (isSelected || isRelated) {
            opacity = 1;
        } else {
            opacity = 0.1; // Dim unconnected nodes
        }
    }

    ctx.globalAlpha = opacity;

    // Determine size
    // Base size on value, but clamp it
    const baseR = Math.max(2, Math.min(node.val || 4, 10)); 
    const r = isSelected || isHovered ? baseR * 1.5 : baseR;

    const color = getNodeColor(node);

    // Draw Glow/Halo for important nodes or selected/hovered
    if (node.type === 'hour' || node.type === 'faction' || isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, r * 2.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = isSelected ? 'rgba(244, 114, 182, 0.2)' : `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.15)`;
        ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = color;
    
    // Shape logic based on type
    if (node.type === 'faction') {
        // Diamond (Rhombus)
        ctx.moveTo(node.x!, node.y! - r * 1.2);
        ctx.lineTo(node.x! + r * 1.2, node.y!);
        ctx.lineTo(node.x!, node.y! + r * 1.2);
        ctx.lineTo(node.x! - r * 1.2, node.y!);
        ctx.closePath();
    } else if (node.type === 'location') {
        // Triangle (pointing up)
        ctx.moveTo(node.x!, node.y! - r);
        ctx.lineTo(node.x! + r, node.y! + r);
        ctx.lineTo(node.x! - r, node.y! + r);
        ctx.closePath();
    } else if (node.type === 'book') {
        // Square
        ctx.rect(node.x! - r, node.y! - r, r * 2, r * 2);
    } else if (node.type === 'event') {
        // Hexagon
        const sides = 6;
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = node.x! + r * Math.cos(angle);
            const y = node.y! + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    } else {
        // Default Circle (Hour, Person, etc.)
        ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI, false);
    }

    // Inner Glow for "Star" effect
    ctx.shadowColor = color;
    ctx.shadowBlur = isSelected ? 20 : (node.type === 'hour' ? 15 : 5);
    
    ctx.fill();
    ctx.shadowBlur = 0; // Reset

    // Stroke for highlighted/selected
    // Always add a subtle border to make nodes pop
    ctx.lineWidth = (isSelected || isHighlighted ? 2 : 0.5) / globalScale;
    ctx.strokeStyle = isSelected ? THEME.selection : (isHighlighted ? THEME.highlight : 'rgba(255,255,255,0.8)');
    ctx.stroke();

    // Draw Label
    // Show label if:
    // 1. Node is hovered or selected
    // 2. Node is an "Hour" or "Faction" (important)
    // 3. Zoom level is high enough (globalScale > 2)
    // 4. Node is related to selection (in focus mode)
    const shouldShowLabel = isSelected || isHovered || ((selectedNode || selectedLink) && isRelated) || (!selectedNode && !selectedLink && (node.type === 'hour' || node.type === 'faction' || globalScale > 2.5));

    if (shouldShowLabel) {
      const fontSize = isSelected || isHovered ? 14 / globalScale : 10 / globalScale;
      ctx.font = `${fontSize}px 'Crimson Text', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      ctx.fillStyle = isSelected ? THEME.faction : 'rgba(234, 221, 207, 0.9)'; // Gold or Parchment
      
      // Simple shadow for text
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.fillText(label, node.x!, node.y! + r + 4);
      ctx.shadowBlur = 0;
    }

    // Reset globalAlpha for next draw calls
    ctx.globalAlpha = 1;
  }, [selectedNode, selectedLink, hoverNode, highlightNodes, relatedNodes]);

  const paintLink = useCallback((link: Link, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const source = link.source as Node;
    const target = link.target as Node;

    // Safety check
    if (typeof source !== 'object' || typeof target !== 'object' || !source.x || !source.y || !target.x || !target.y) return;

    const isRelated = relatedLinks.has(link) || link === selectedLink;
    const isHighlighted = highlightLinks.has(link);
    const isSelectedMode = !!selectedNode || !!selectedLink;

    // Visibility & Style
    let strokeStyle = 'rgba(200, 230, 255, 0.1)';
    let lineWidth = 0.5 / globalScale;

    if (isSelectedMode) {
        if (isRelated) {
            strokeStyle = 'rgba(200, 230, 255, 0.4)';
            lineWidth = 1.5 / globalScale;
        } else {
            strokeStyle = 'rgba(200, 230, 255, 0.02)';
            lineWidth = 0.2 / globalScale;
        }
    } else {
        if (isHighlighted) {
            strokeStyle = 'rgba(200, 230, 255, 0.6)';
            lineWidth = 1.5 / globalScale;
        }
    }

    // Draw Line
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Draw Label
    // Only show label if:
    // 1. Link is related (in selection mode) OR Link is highlighted (in hover mode)
    // 2. AND we have a label
    if ((isRelated || isHighlighted) && link.label) {
        // Split labels by comma or pipe, and translate
        const rawLabels = link.label.split(/[,|]/);
        const labels = rawLabels.map(l => translateLabel(l.trim())).filter(Boolean);
        
        if (labels.length === 0) return;

        const fontSize = Math.max(4, 12 / globalScale);
        ctx.font = `${fontSize}px 'Crimson Text', serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Calculate distance to avoid overlapping nodes
        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If distance is too small, just show the first label in the center
        if (dist < 40) {
             const text = labels[0];
             const midX = (source.x! + target.x!) / 2;
             const midY = (source.y! + target.y!) / 2;
             
             const textMetrics = ctx.measureText(text);
             const textWidth = textMetrics.width;
             const padding = 2 / globalScale;
             const boxHeight = fontSize + padding * 2;
             const boxWidth = textWidth + padding * 2;

             ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
             ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
             ctx.lineWidth = 1 / globalScale;
             ctx.beginPath();
             ctx.roundRect(midX - boxWidth / 2, midY - boxHeight / 2, boxWidth, boxHeight, 2 / globalScale);
             ctx.fill();
             ctx.stroke();
             
             ctx.fillStyle = '#e2e8f0';
             ctx.fillText(text, midX, midY);
             return;
        }

        // Distribute labels along the line
        // Keep within 35% - 65% to avoid nodes
        const startT = 0.35;
        const endT = 0.65;
        const step = labels.length > 1 ? (endT - startT) / (labels.length - 1) : 0;

        labels.forEach((text, i) => {
            let t = 0.5;
            if (labels.length > 1) {
                t = startT + i * step;
            }

            const posX = source.x! + dx * t;
            const posY = source.y! + dy * t;

            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const padding = 3 / globalScale;
            const boxHeight = fontSize + padding * 2;
            const boxWidth = textWidth + padding * 2;

            // Draw background box (pill shape)
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'; // Darker background
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)'; // Gold border
            ctx.lineWidth = 1 / globalScale;
            
            ctx.beginPath();
            // Use roundRect if available, else rect
            if (ctx.roundRect) {
                ctx.roundRect(posX - boxWidth / 2, posY - boxHeight / 2, boxWidth, boxHeight, 4 / globalScale);
            } else {
                ctx.rect(posX - boxWidth / 2, posY - boxHeight / 2, boxWidth, boxHeight);
            }
            ctx.fill();
            ctx.stroke();

            // Draw Text
            ctx.fillStyle = '#f1f5f9'; // Brighter text
            ctx.fillText(text, posX, posY);
        });
    }
  }, [selectedNode, selectedLink, relatedLinks, highlightLinks]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-transparent text-white overflow-hidden rounded-lg">
      {/* Header / Controls */}
      <div className="absolute top-4 left-4 z-10 glass-panel p-4 rounded shadow-lg w-72 backdrop-blur-sm">
        <h2 className="text-lg font-bold mb-2 text-yellow-500 font-display">知识图谱 (Lore Network)</h2>
        <input
          type="text"
          placeholder="搜索实体..."
          className="w-full p-2 bg-black/40 rounded border border-gold/20 text-white mb-2 font-serif focus:border-gold/50 outline-none transition-colors"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="text-xs text-gray-400 font-serif">
          节点: {data.nodes.length} | 连接: {data.links.length}
        </div>
        
        <div className="mt-2 mb-2 flex flex-col gap-2">
            <label className="flex items-center text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                <input 
                    type="checkbox" 
                    checked={isResearchMode} 
                    onChange={e => {
                        const isResearch = e.target.checked;
                        setIsResearchMode(isResearch);
                        // If switching to Research Mode, turn off Ambient Motion by default
                        // If switching to Galaxy Mode, turn on Ambient Motion by default
                        setIsAmbientMotion(!isResearch);
                    }}
                    className="mr-2 accent-yellow-500"
                />
                研究模式 (Research Mode)
            </label>
            <label className="flex items-center text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                <input 
                    type="checkbox" 
                    checked={isAmbientMotion} 
                    onChange={e => setIsAmbientMotion(e.target.checked)}
                    className="mr-2 accent-yellow-500"
                />
                星空漂移 (Ambient Drift)
            </label>
        </div>

        <div className="mt-2 text-xs grid grid-cols-2 gap-2 font-serif">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#fbbf24] mr-1 rounded-full shadow-[0_0_5px_#fbbf24]"></span>
            司辰 (Hour)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#facc15] mr-1 rotate-45 transform origin-center"></span>
            阵营 (Faction)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-[#22d3ee] mr-1"></span>
            地点 (Location)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#a78bfa] mr-1"></span>
            书籍 (Book)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#f87171] mr-1" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></span>
            事件 (Event)
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#94a3b8] mr-1 rounded-full"></span>
            人物/其他
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 glass-panel p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto border-l-4 border-yellow-500 animate-fade-in">
          <button 
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            onClick={() => setSelectedNode(null)}
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold mb-1 font-display text-gold drop-shadow-md">{formatLabel(selectedNode)}</h3>
          <p className="text-sm text-gray-500 mb-4 font-mono">{selectedNode.id}</p>
          
          <div className="space-y-4 font-serif">
            {selectedNode.data?.description && (
              <div>
                <h4 className="font-semibold text-yellow-500 border-b border-gray-700 pb-1 mb-2">描述 (Description)</h4>
                <p className="text-sm leading-relaxed text-parchment/90">{selectedNode.data.description}</p>
              </div>
            )}
            
            {selectedNode.data?.origin && (
              <div>
                <h4 className="font-semibold text-yellow-500 border-b border-gray-700 pb-1 mb-2">起源 (Origin)</h4>
                <p className="text-sm text-parchment/90">{selectedNode.data.origin}</p>
              </div>
            )}

            {selectedNode.data?.factions && selectedNode.data.factions.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-500 border-b border-gray-700 pb-1 mb-2">阵营 (Factions)</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.data.factions.map(f => (
                    <span key={f} className="px-2 py-1 bg-black/40 rounded text-xs text-parchment/90 border border-gold/20">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.data?.aliases && selectedNode.data.aliases.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-500 border-b border-gray-700 pb-1 mb-2">别名 (Aliases)</h4>
                <ul className="list-disc list-inside text-sm text-parchment/70">
                  {selectedNode.data.aliases.map(a => <li key={a}>{a}</li>)}
                </ul>
              </div>
            )}

            {selectedNode.data?.mentions && selectedNode.data.mentions.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-500 border-b border-gray-700 pb-1 mb-2">提及于 (Mentioned In)</h4>
                <ul className="list-disc list-inside text-sm text-parchment/70 max-h-40 overflow-y-auto custom-scrollbar">
                  {selectedNode.data.mentions.map(m => (
                    <li key={m.id} className="truncate" title={m.name}>
                      {m.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Graph */}
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel={(node: any) => formatLabel(node)}
        nodeColor={node => (node as Node).color}
        nodeRelSize={6}
        linkColor={link => {
            if (selectedNode || selectedLink) {
                return relatedLinks.has(link as Link) ? 'rgba(200, 230, 255, 0.2)' : 'rgba(200, 230, 255, 0.02)';
            }
            return 'rgba(200, 230, 255, 0.1)';
        }}
        linkWidth={link => {
            if (selectedNode || selectedLink) {
                return relatedLinks.has(link as Link) ? 2 : 0.5;
            }
            return highlightLinks.has(link as Link) ? 2 : 0.5;
        }}
        linkDirectionalParticles={link => {
            if (selectedNode || selectedLink) {
                return relatedLinks.has(link as Link) ? 4 : 0;
            }
            return highlightLinks.has(link as Link) ? 4 : 0;
        }}
        linkDirectionalParticleWidth={2}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => {
            setSelectedNode(null);
            setSelectedLink(null);
        }}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        backgroundColor="rgba(0,0,0,0)" // Transparent to show cosmic background
        cooldownTicks={100} // Initial layout ticks
        d3AlphaDecay={alphaDecay}
        d3VelocityDecay={velocityDecay}
        onEngineStop={() => {
            // When engine stops, if ambient motion is on, restart it with low alpha decay to keep it moving
            if (isAmbientMotionRef.current) {
                setAlphaDecay(0); // Stop decay to keep moving forever
                setVelocityDecay(0.6); // High friction to prevent twitching
                if (graphRef.current) {
                    graphRef.current.d3ReheatSimulation();
                }
            }
        }}
      />
    </div>
  );
};

export default LoreNetworkGraph;
