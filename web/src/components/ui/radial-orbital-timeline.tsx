"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// SSR-safe layout effect
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

export default function RadialOrbitalTimeline({
  timelineData,
  className,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(180);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Responsively size the orbit to match the container
  useIsoLayoutEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const w = containerRef.current?.clientWidth ?? 0;
      // radius = ~30% of width, clamped between 110 and 220
      const r = Math.max(110, Math.min(220, w * 0.3));
      setRadius(r);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newState[parseInt(key)] = parseInt(key) === id ? !prev[id] : false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval> | undefined;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
      }, 50);
    }
    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusVariant = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "in-progress":
        return "accent" as const;
      case "pending":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--bg)]",
        "min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]",
        className
      )}
    >
      {/* Subtle grid backdrop */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" aria-hidden />
      {/* Center radial glow - pulls eye to the core */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 50%)",
        }}
      />

      <div
        ref={orbitRef}
        className="relative h-full w-full flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Central core - vibrant SVG monogram */}
        <div className="absolute z-10 flex h-24 w-24 items-center justify-center" aria-hidden>
          {/* Outer ping rings */}
          <span
            className="absolute h-28 w-28 rounded-full border border-[color:var(--accent)]/40 animate-ping opacity-60"
          />
          <span
            className="absolute h-32 w-32 rounded-full border border-[color:var(--accent)]/20 animate-ping opacity-40"
            style={{ animationDelay: "0.5s" }}
          />
          {/* Bloom glow */}
          <span
            className="absolute h-32 w-32 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 50%, transparent) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          {/* SVG vibrant core */}
          <svg
            viewBox="0 0 100 100"
            className="relative h-20 w-20 drop-shadow-[0_8px_24px_rgba(129,140,248,0.6)]"
          >
            <defs>
              <radialGradient id="orbital-core-bg" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#C7D2FE" />
                <stop offset="35%" stopColor="#818CF8" />
                <stop offset="75%" stopColor="#5B5BD6" />
                <stop offset="100%" stopColor="#312E81" />
              </radialGradient>
              <linearGradient id="orbital-core-shine" x1="0" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.45" />
                <stop offset="60%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <filter id="orbital-core-inner" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Sphere */}
            <circle cx="50" cy="50" r="44" fill="url(#orbital-core-bg)" />
            {/* Top highlight */}
            <ellipse cx="40" cy="34" rx="22" ry="14" fill="url(#orbital-core-shine)" />
            {/* Equator ring */}
            <ellipse
              cx="50"
              cy="50"
              rx="44"
              ry="9"
              fill="none"
              stroke="white"
              strokeOpacity="0.18"
              strokeWidth="0.6"
            />
            {/* VK monogram */}
            <g
              fill="white"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontWeight="700"
              fontSize="22"
              textAnchor="middle"
              style={{ letterSpacing: "-0.02em" }}
            >
              <text x="50" y="58" filter="url(#orbital-core-inner)" opacity="0.5">
                VK
              </text>
              <text x="50" y="58">VK</text>
            </g>
            {/* Bottom shadow / depth */}
            <ellipse cx="50" cy="78" rx="30" ry="6" fill="black" opacity="0.18" />
          </svg>
        </div>

        {/* Orbital ring */}
        {/* Visual ring - sized off the dynamic radius */}
        <div
          className="absolute rounded-full border border-[color:var(--border-strong)]/40"
          style={{ width: radius * 2, height: radius * 2 }}
          aria-hidden
        />

        {/* Nodes */}
        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          const nodeStyle = {
            transform: `translate(${position.x}px, ${position.y}px)`,
            zIndex: isExpanded ? 200 : position.zIndex,
            opacity: isExpanded ? 1 : position.opacity,
          };

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[item.id] = el;
              }}
              className="absolute cursor-pointer transition duration-700"
              style={nodeStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Aura */}
              <div
                className={cn(
                  "absolute -inset-2 rounded-full",
                  isPulsing && "animate-pulse"
                )}
                style={{
                  background: `radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 70%)`,
                  width: `${item.energy * 0.5 + 44}px`,
                  height: `${item.energy * 0.5 + 44}px`,
                  left: `-${(item.energy * 0.5 + 44 - 40) / 2}px`,
                  top: `-${(item.energy * 0.5 + 44 - 40) / 2}px`,
                }}
                aria-hidden
              />

              {/* Node circle */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition duration-300",
                  isExpanded
                    ? "scale-150 border-[color:var(--text-primary)] bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] shadow-lg"
                    : isRelated
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)]/20 text-[color:var(--accent)] animate-pulse"
                      : "border-[color:var(--border-strong)] bg-[color:var(--bg-elevated)] text-[color:var(--text-secondary)]"
                )}
              >
                <Icon size={16} />
              </div>

              {/* Label */}
              <div
                className={cn(
                  "absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-wider transition duration-300",
                  isExpanded
                    ? "scale-110 text-[color:var(--text-primary)]"
                    : "text-[color:var(--text-secondary)]"
                )}
              >
                {item.title}
              </div>

              {/* Detail card */}
              {isExpanded && (
                <Card className="absolute left-1/2 top-24 w-[min(280px,90vw)] sm:w-72 -translate-x-1/2 backdrop-blur-md">
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-[color:var(--accent)]/50"
                    aria-hidden
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status === "completed"
                          ? "Done"
                          : item.status === "in-progress"
                            ? "Active"
                            : "Next"}
                      </Badge>
                      <span className="font-mono text-[11px] text-[color:var(--text-tertiary)]">
                        {item.date}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-[14px]">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-[12.5px] leading-relaxed text-[color:var(--text-secondary)]">
                    <p>{item.content}</p>

                    <div className="mt-4 border-t border-[color:var(--border)] pt-3">
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
                          <Zap size={10} />
                          Progress
                        </span>
                        <span className="font-mono text-[color:var(--text-primary)]">
                          {item.energy}%
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-[color:var(--bg-muted)]">
                        <div
                          className="h-full bg-[color:var(--accent)]"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t border-[color:var(--border)] pt-3">
                        <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                          <LinkIcon size={10} />
                          Connected steps
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = timelineData.find((i) => i.id === relatedId);
                            return (
                              <button
                                key={relatedId}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relatedId);
                                }}
                                className="inline-flex h-6 items-center gap-1 rounded border border-[color:var(--border)] bg-transparent px-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
                              >
                                {relatedItem?.title}
                                <ArrowRight size={10} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
