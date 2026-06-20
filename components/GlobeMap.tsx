"use client";

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html, Stars, Ring } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { motion } from 'framer-motion';
import { getStabilityColor, countries, getAllCountries, getCountryById, getPhaseFromStability } from '@/lib/geopoliticalData';
import { useIsMobile } from '@/hooks/use-mobile';
import { getShockScore } from '@/lib/GlobalShockDataset';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GlobeMapProps {
    countryStabilities: Record<string, number>;
    isCollapsed: boolean;
    onCountryHover?: (countryId: string | null) => void;
    onCountryClick?: (countryId: string) => void;
    onSanction?: (countryId: string) => void;
    className?: string;
    rotation?: number;
    onRotationChange?: (rotation: number) => void;
    interactive?: boolean;
    highlightedEntities?: string[];
    userOrigin?: string | null;
    sentiments?: Record<string, { mood: string; emoji: string; color: string; intensity: number }>;
    dataDrift?: number; // [Refinement]
}

interface TooltipData {
    id: string;
    country: string;
    flag: string;
    stability: number;
    phase: string;
    position: THREE.Vector3;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const GLOBE_RADIUS = 2;
const SEGMENTS = 64;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Convert lat/long to 3D coordinates on sphere
function latLongToVector3(lat: number, long: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// ============================================================================
// VISUAL EFFECTS COMPONENTS
// ============================================================================

function SanctionBeam({ start, end, onComplete }: { start: THREE.Vector3, end: THREE.Vector3, onComplete: () => void }) {
    const beamRef = useRef<THREE.Group>(null);
    const [progress, setProgress] = useState(0);

    useFrame((state, delta) => {
        setProgress(p => {
            if (p >= 1) return 1;
            return p + delta * 2;
        });
    });

    useEffect(() => {
        const timer = setTimeout(onComplete, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const currentEnd = useMemo(() => {
        return new THREE.Vector3().lerpVectors(start, end, progress);
    }, [start, end, progress]);

    return (
        <group ref={beamRef}>
            <Line
                points={[start, currentEnd]}
                color="#ff3300"
                lineWidth={3}
                transparent
                opacity={1 - progress * 0.5}
            />
            {progress < 1 && (
                <Sphere args={[0.05, 8, 8]} position={currentEnd}>
                    <meshStandardMaterial color="#ffaa00" emissive="#ffdd00" emissiveIntensity={2} />
                </Sphere>
            )}
            {progress === 1 && (
                <Ring args={[0.01, 0.2, 32]} position={end} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#ff3300" transparent opacity={0.5} />
                </Ring>
            )}
        </group>
    );
}

function ImpactPulse({ position, onComplete }: { position: THREE.Vector3, onComplete: () => void }) {
    const [scale, setScale] = useState(0.1);
    const [opacity, setOpacity] = useState(1);

    useFrame((state, delta) => {
        setScale(s => s + delta * 5);
        setOpacity(o => Math.max(0, o - delta * 2));
    });

    useEffect(() => {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <group position={position}>
            <Sphere args={[scale, 16, 16]}>
                <meshBasicMaterial color="#ff3300" transparent opacity={opacity * 0.5} />
            </Sphere>
            <Ring args={[scale * 0.8, scale, 32]}>
                <meshBasicMaterial color="#ffaa00" transparent opacity={opacity} side={THREE.DoubleSide} />
            </Ring>
        </group>
    );
}

// [NEW] Hub Visualizer for Phase 3 Logistics Nodes
function HubVisualizer({ countryId, position }: { countryId: string, position: THREE.Vector3 }) {
    const ringRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.02;
            const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 0.8;
            ringRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group position={position} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize())}>
            <Ring args={[0.15, 0.16, 32]}>
                <meshBasicMaterial color="#00ffff" transparent opacity={0.6} side={THREE.DoubleSide} />
            </Ring>
            <Ring args={[0.18, 0.19, 32]}>
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} side={THREE.DoubleSide} />
            </Ring>
            {/* Spinning crosshair segments */}
            <group ref={ringRef}>
                {[0, 90, 180, 270].map((rot) => (
                    <mesh key={rot} rotation={[0, 0, (rot * Math.PI) / 180]}>
                        <planeGeometry args={[0.02, 0.1]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

function ResourceStream({ start, end, onComplete }: { start: THREE.Vector3, end: THREE.Vector3, onComplete: () => void }) {
    const [particles] = useState(() => Array.from({ length: 5 }, () => ({
        offset: Math.random(),
        speed: 0.5 + Math.random() * 0.5,
        id: Math.random()
    })));
    const [progress, setProgress] = useState(0);

    useFrame((state, delta) => {
        setProgress(p => {
            if (p >= 1) return 1;
            return p + delta * 0.8;
        });
    });

    useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <group>
            {particles.map(p => {
                const particleProgress = (progress * p.speed + p.offset) % 1;
                const pos = new THREE.Vector3().lerpVectors(start, end, particleProgress);
                return (
                    <Sphere key={p.id} args={[0.03, 8, 8]} position={pos}>
                        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={2} />
                    </Sphere>
                );
            })}
        </group>
    );
}

// Convert hex color to THREE.Color
function hexToThreeColor(hex: string): THREE.Color {
    return new THREE.Color(hex);
}

interface CountryMeshProps {
    countryId: string;
    coordinates: [number, number][];
    stability: number;
    isCollapsed: boolean;
    isHovered: boolean;
    isHighlighted?: boolean;
    isUserOrigin?: boolean;
    onHover: (id: string | null) => void;
    onClick: (id: string, point?: THREE.Vector3) => void;
}

function CountryMesh({
    countryId,
    coordinates,
    stability,
    isCollapsed,
    isHovered,
    isHighlighted,
    isUserOrigin,
    onHover,
    onClick
}: CountryMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const color = getStabilityColor(stability);

    // Create points for the country boundary line
    const points = useMemo(() => {
        return coordinates.map(([long, lat]) =>
            latLongToVector3(lat, long, GLOBE_RADIUS + 0.01)
        );
    }, [coordinates]);

    // Create filled polygon shape
    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const projectedPoints = coordinates.map(([long, lat]) => ({
            x: long * 0.1,
            y: lat * 0.1
        }));

        shape.moveTo(projectedPoints[0].x, projectedPoints[0].y);
        projectedPoints.slice(1).forEach(p => shape.lineTo(p.x, p.y));
        shape.closePath();

        const geo = new THREE.ShapeGeometry(shape);

        // Project vertices onto sphere
        const positions = geo.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i) / 0.1;
            const y = positions.getY(i) / 0.1;
            const vec = latLongToVector3(y, x, GLOBE_RADIUS + 0.005);
            positions.setXYZ(i, vec.x, vec.y, vec.z);
        }
        positions.needsUpdate = true;
        geo.computeVertexNormals();

        return geo;
    }, [coordinates]);

    // Animate on hover and highlight with stability-linked dynamics
    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();

            // Stability metrics
            const isUnstable = stability < 60;
            const isCritical = stability < 40;

            // Pulse speed increases as stability drops: 1Hz (stable) -> 8Hz (critical)
            const pulseFreq = isCritical ? 12 : (isUnstable ? 6 : 2);
            const pulse = (Math.sin(time * pulseFreq) * 0.5 + 0.5);

            // Emissive dynamics
            const material = meshRef.current.material as THREE.MeshStandardMaterial;

            if (isHighlighted || isUserOrigin) {
                material.emissiveIntensity = 0.8 + pulse * 1.2;
                material.emissive = new THREE.Color(isCollapsed ? '#ff0000' : (isUserOrigin ? '#00ff44' : '#00ffff'));
            } else if (isCollapsed) {
                material.emissiveIntensity = 0.4 + pulse * 0.4;
                material.emissive = new THREE.Color('#ff0000');
            } else if (isCritical) {
                // Violent red pulsing for critical countries
                material.emissiveIntensity = 1.0 + pulse * 1.5;
                material.emissive = new THREE.Color('#ff3300');

                // Add jitter
                if (Math.random() > 0.9) {
                    meshRef.current.position.set(
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02,
                        (Math.random() - 0.5) * 0.02
                    );
                } else {
                    meshRef.current.position.set(0, 0, 0);
                }
            } else if (isUnstable) {
                // Warning orange pulse
                material.emissiveIntensity = 0.5 + pulse * 0.5;
                material.emissive = new THREE.Color('#ffaa00');
            } else {
                // Subtle static glow for stable countries
                material.emissiveIntensity = 0.2;
                material.emissive = new THREE.Color(color);
                meshRef.current.position.set(0, 0, 0);
            }

            // Opacity handling
            const targetOpacity = isHovered ? 0.95 : (isHighlighted || isUserOrigin ? 0.85 : 0.7);
            material.opacity += (targetOpacity - material.opacity) * 0.1;
        }
    });

    return (
        <group>
            {/* Filled country shape */}
            <mesh
                ref={meshRef}
                geometry={geometry}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    onHover(countryId);
                }}
                onPointerOut={() => onHover(null)}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(countryId, e.point);
                }}
            >
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.7}
                    side={THREE.DoubleSide}
                    emissive={isCollapsed ? new THREE.Color('#ff0000') : new THREE.Color(color)}
                    emissiveIntensity={isCollapsed ? 0.8 : 0.4}
                    metalness={0.9}
                    roughness={0.1}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    reflectivity={1.0}
                />
            </mesh>

            {/* Country border line */}
            <Line
                points={points}
                color={isHovered || isHighlighted ? "#00ffff" : "rgba(0, 255, 255, 0.6)"}
                lineWidth={isHovered || isHighlighted ? 2 : 1}
            />
        </group>
    );
}

// ============================================================================
// GLOBE COMPONENT (Inner)
// ============================================================================

interface GlobeInnerProps {
    countryStabilities: Record<string, number>;
    isCollapsed: boolean;
    onCountryHover?: (countryId: string | null) => void;
    onCountryClick?: (countryId: string) => void;
    onSanction?: (countryId: string) => void;
    setTooltip: (data: TooltipData | null) => void;
    rotation?: number;
    onRotationChange?: (rotation: number) => void;
    interactive?: boolean;
    highlightedEntities?: string[];
    userOrigin?: string | null;
    dataDrift?: number;
}

function GlobeInner({
    countryStabilities,
    isCollapsed,
    onCountryHover,
    onCountryClick,
    setTooltip,
    rotation,
    onRotationChange,
    interactive = true,
    highlightedEntities = [],
    onSanction,
    userOrigin,
    dataDrift = 0
}: GlobeInnerProps) {
    const globeRef = useRef<THREE.Group>(null);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [worldData, setWorldData] = useState<any[]>([]);
    const [beams, setBeams] = useState<Array<{ id: string, start: THREE.Vector3, end: THREE.Vector3 }>>([]);
    const [impacts, setImpacts] = useState<Array<{ id: string, position: THREE.Vector3 }>>([]);
    const [streams, setStreams] = useState<Array<{ id: string, start: THREE.Vector3, end: THREE.Vector3 }>>([]);
    const isMobile = useIsMobile();

    React.useEffect(() => {
        fetch('/world-data.json')
            .then(res => res.json())
            .then(data => {
                const countries = (feature(data, data.objects.countries) as any).features;
                setWorldData(countries);
            })
            .catch(err => console.error("Failed to load world data", err));
    }, []);

    // Update internal rotation from prop
    useFrame((state, delta) => {
        if (globeRef.current) {
            if (rotation !== undefined) {
                globeRef.current.rotation.y = rotation;
            } else if (!hoveredCountry && interactive) {
                globeRef.current.rotation.y += delta * 0.05;
                onRotationChange?.(globeRef.current.rotation.y);
            }
        }
    });

    const handleInteraction = useCallback((countryId: string | null, point?: THREE.Vector3) => {
        setHoveredCountry(countryId);
        onCountryHover?.(countryId);

        if (countryId) {
            const countryInfo = getCountryById(countryId);
            if (countryInfo) {
                const stability = countryStabilities[countryId] ?? 100;
                const phase = getPhaseFromStability(stability);

                setTooltip({
                    id: countryId,
                    country: countryInfo.name,
                    flag: countryInfo.flag,
                    stability: stability,
                    phase: phase,
                    position: point || new THREE.Vector3(0, 0, 0)
                });
            }
        } else {
            setTooltip(null);
        }

        // [NEW] Hub Supply Chain Visualization on Hover
        if (countryId) {
            const country = getCountryById(countryId);
            if (country?.isGlobalHub && country.beneficiaries) {
                // Clear old streams first to avoid clutter
                setStreams([]);

                const startPos = latLongToVector3(country.position.lat, country.position.lng, GLOBE_RADIUS + 0.1);

                country.beneficiaries.slice(0, 5).forEach((bId, idx) => {
                    const bCountry = getCountryById(bId);
                    if (bCountry) {
                        const endPos = latLongToVector3(bCountry.position.lat, bCountry.position.lng, GLOBE_RADIUS + 0.1);
                        // Add a slight delay for a "scanning" effect
                        setTimeout(() => {
                            setStreams(prev => [...prev, {
                                id: `supply-${countryId}-${bId}-${Date.now()}`,
                                start: startPos,
                                end: endPos
                            }]);
                        }, idx * 100);
                    }
                });
            }
        } else {
            // Optional: Clear streams when not hovering, or let them fade out naturally (requires refactor of ResourceStream to handle fade)
            // For now, let's keep them until next hover or timeout
        }

    }, [countryStabilities, onCountryHover, setTooltip]);

    const handleClick = useCallback((countryId: string, point?: THREE.Vector3) => {
        if (isMobile) {
            // Toggle tooltip on mobile instead of just hover
            if (hoveredCountry === countryId) {
                handleInteraction(null);
            } else {
                handleInteraction(countryId, point);
            }
        }
        if (onSanction) {
            // Find start and end positions
            const startCountry = getCountryById(userOrigin || '');
            if (startCountry && point) {
                const startPos = latLongToVector3(startCountry.position.lat, startCountry.position.lng, GLOBE_RADIUS + 0.1);
                setBeams(prev => [...prev, { id: `${Date.now()}`, start: startPos, end: point }]);

                // Add impact pulse after beam travel time (roughly 500ms-1000ms based on progress speed)
                setTimeout(() => {
                    setImpacts(prev => [...prev, { id: `impact-${Date.now()}`, position: point }]);

                    // Trigger resource flow if there are beneficiaries
                    const target = getCountryById(countryId);
                    if (target && target.beneficiaries && target.beneficiaries.length > 0) {
                        target.beneficiaries.forEach(bId => {
                            const beneficiary = getCountryById(bId);
                            if (beneficiary) {
                                const bPos = latLongToVector3(beneficiary.position.lat, beneficiary.position.lng, GLOBE_RADIUS + 0.1);
                                setStreams(prev => [...prev, { id: `stream-${Date.now()}-${bId}`, start: point, end: bPos }]);

                                if (bId === userOrigin && (window as any).addAppNotification) {
                                    (window as any).addAppNotification({
                                        type: 'profit',
                                        title: 'STRATEGIC GAIN',
                                        message: `Exploiting market gap left by ${target.name}`
                                    });
                                }
                            }
                        });
                    }
                }, 750);
            }
            onSanction(countryId);
        }
        onCountryClick?.(countryId);
    }, [onCountryClick, onSanction, userOrigin, isMobile, hoveredCountry, handleInteraction]);

    return (
        <group ref={globeRef}>
            <Sphere args={[GLOBE_RADIUS, SEGMENTS, SEGMENTS]}>
                <meshPhysicalMaterial
                    color="#020617"
                    transparent
                    opacity={0.99}
                    roughness={0.05}
                    metalness={0.95}
                    clearcoat={1.0}
                    clearcoatRoughness={0.02}
                    emissive={dataDrift > 0.4 && Math.random() > 0.8 ? "#ff0000" : "#000814"}
                    emissiveIntensity={dataDrift > 0.4 ? 2.0 : 0.8}
                    transmission={0.05}
                    thickness={2}
                    reflectivity={1}
                />


            </Sphere>

            <Sphere args={[GLOBE_RADIUS + 0.001, 64, 64]}>
                <meshBasicMaterial color="#1e40af" transparent opacity={0.15} wireframe />
            </Sphere>

            <Sphere args={[GLOBE_RADIUS + 0.005, 32, 32]}>
                <meshBasicMaterial color="#00ffff" transparent opacity={0.05} wireframe />
            </Sphere>

            {/* Scrolling Scanline Effect */}
            <ScanningRing radius={GLOBE_RADIUS + 0.1} />


            {/* Sanction Beams */}
            {beams.map(beam => (
                <SanctionBeam
                    key={beam.id}
                    start={beam.start}
                    end={beam.end}
                    onComplete={() => setBeams(prev => prev.filter(b => b.id !== beam.id))}
                />
            ))}

            {/* Impact Pulses */}
            {impacts.map(impact => (
                <ImpactPulse
                    key={impact.id}
                    position={impact.position}
                    onComplete={() => setImpacts(prev => prev.filter(i => i.id !== impact.id))}
                />
            ))}

            {/* Resource Streams */}
            {streams.map(stream => (
                <ResourceStream
                    key={stream.id}
                    start={stream.start}
                    end={stream.end}
                    onComplete={() => setStreams(prev => prev.filter(s => s.id !== stream.id))}
                />
            ))}

            {worldData.map((feature, i) => {
                const countryName = feature.properties.name?.toLowerCase().replace(/\s+/g, '_') || `unknown_${i}`;
                let simulationId = countryName;
                if (countryName === 'united_states_of_america') simulationId = 'usa';
                if (countryName === 'russian_federation') simulationId = 'russia';
                if (countryName === 'united_kingdom') simulationId = 'uk';

                const isSimulated = !!getCountryById(simulationId);
                const countryInfo = getCountryById(simulationId);
                if (!isSimulated || !countryInfo) return null;

                const stability = countryStabilities[simulationId] ?? 100;

                const geometries = [];
                if (feature.geometry.type === 'Polygon') {
                    geometries.push(feature.geometry.coordinates[0]);
                } else if (feature.geometry.type === 'MultiPolygon') {
                    feature.geometry.coordinates.forEach((polygon: any) => geometries.push(polygon[0]));
                }

                // Calculate centroid for flag placement
                const centroid = feature.geometry.type === 'Polygon'
                    ? d3.geoCentroid(feature)
                    : d3.geoCentroid(feature); // d3 handles multipolygon
                const flagPos = latLongToVector3(centroid[1], centroid[0], GLOBE_RADIUS + 0.05);

                return (
                    <group key={`${simulationId}-group`}>
                        {geometries.map((coords: any[], idx) => (
                            <CountryMesh
                                key={`${simulationId}-${idx}`}
                                countryId={simulationId}
                                coordinates={coords}
                                stability={stability}
                                isCollapsed={isCollapsed}
                                isHovered={hoveredCountry === simulationId}
                                isHighlighted={highlightedEntities.some(e => e.toLowerCase() === simulationId.toLowerCase())}
                                isUserOrigin={userOrigin === simulationId}
                                onHover={(id) => handleInteraction(id)}
                                onClick={(id, pt) => handleClick(id, pt)}
                            />
                        ))}
                        {/* Hub Visualization */}
                        {countryInfo?.isGlobalHub && (
                            <HubVisualizer
                                countryId={simulationId}
                                position={flagPos}
                            />
                        )}
                    </group>
                );
            })}

            {/* Atmosphere - Enhanced Fresnel Effect */}
            <Sphere args={[GLOBE_RADIUS * 1.05, 64, 64]}>
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
            <Sphere args={[GLOBE_RADIUS * 1.2, 64, 64]}>
                <meshBasicMaterial
                    color={isCollapsed ? "#ff0000" : "#4f46e5"}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
            <Sphere args={[GLOBE_RADIUS * 1.4, 64, 64]}>
                <meshBasicMaterial
                    color="#1e1b4b"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
        </group>
    );
}

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

function Tooltip({ data }: { data: TooltipData }) {
    const isMobile = useIsMobile();
    const phaseColors: Record<string, string> = {
        'STABLE': 'text-green-400',
        'STRESSED': 'text-yellow-400',
        'UNSTABLE': 'text-orange-400',
        'COLLAPSED': 'text-red-400'
    };

    const gds = getShockScore(data.id);

    return (
        <Html position={data.position} center>
            <div className={`bg-black/95 backdrop-blur-md border ${gds ? `border-[${gds.color}]/50` : 'border-cyan-500/50'} rounded-lg shadow-lg ${gds ? `shadow-[${gds.color}]/20` : 'shadow-cyan-500/20'} px-3 py-2 transition-all ${isMobile ? 'min-w-[160px]' : 'min-w-[180px]'}`}>
                <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-1">
                    <div className="flex items-center gap-2">
                        <span className={isMobile ? "text-xl" : "text-lg"}>{data.flag}</span>
                        <span className="text-white font-bold text-sm tracking-tight">{data.country}</span>
                    </div>
                    {gds && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-mono opacity-50">GDS</span>
                            <span className="text-[12px] font-black font-mono" style={{ color: gds.color }}>{gds.score}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500 font-mono uppercase">Stability</span>
                        <span className="font-bold" style={{ color: getStabilityColor(data.stability) }}>
                            {data.stability.toFixed(1)}%
                        </span>
                    </div>

                    {gds && (
                        <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="pt-1 border-t border-white/5"
                        >
                            <div className="text-[8px] font-mono text-gray-500 uppercase mb-0.5">Impact Tier</div>
                            <div className="text-[10px] font-bold tracking-wide uppercase" style={{ color: gds.color }}>
                                {gds.tier}
                            </div>
                            <div className="text-[9px] text-gray-400 mt-1 leading-tight italic">
                                "{gds.reason}"
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Action Button */}
                {!isMobile && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('globe-sanction', { detail: data }));
                        }}
                        className="w-full py-1.5 rounded bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 text-[9px] uppercase font-black font-mono text-red-400 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:animate-pulse">Trigger Sanction Sequence</span>
                    </button>
                )}
            </div>
        </Html>
    );
}

// ============================================================================
// MAIN GLOBE MAP COMPONENT
// ============================================================================

export default function GlobeMap({
    countryStabilities,
    isCollapsed,
    onCountryHover,
    onCountryClick,
    className = '',
    rotation,
    onRotationChange,
    interactive = true,
    highlightedEntities = [],
    onSanction,
    userOrigin,
    dataDrift
}: GlobeMapProps) {
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const isMobile = useIsMobile();

    // Listen for custom sanction event from tooltip
    React.useEffect(() => {
        const handleSanction = (e: any) => {
            const countryId = getCountryById(e.detail.country)?.id;
            if (countryId && onSanction) {
                onSanction(countryId);
                setTooltip(null);
            }
        };
        window.addEventListener('globe-sanction', handleSanction);
        return () => window.removeEventListener('globe-sanction', handleSanction);
    }, [onSanction]);

    // Responsive camera position
    const cameraPosition: [number, number, number] = isMobile ? [0, 0, 7] : [0, 0, 5];

    return (
        <div className={`relative w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: !isMobile }} // Performance tiering
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[15, 15, 15]} intensity={2.5} color="#4f46e5" />
                <pointLight position={[-15, -15, -15]} intensity={3} color="#00ffff" />
                <pointLight position={[0, 20, 0]} intensity={1.5} color="#ffffff" />
                <pointLight position={[20, 0, -20]} intensity={2} color="#f43f5e" />
                <Stars radius={150} depth={50} count={isMobile ? 2000 : 5000} factor={7} fade speed={1} />

                {/* Scanner Rings - Multi-layered */}
                {!isMobile && (
                    <group rotation={[Math.PI / 2, 0, 0]}>
                        <Ring args={[GLOBE_RADIUS * 1.35, GLOBE_RADIUS * 1.36, 128]}>
                            <meshBasicMaterial color="#00ffff" transparent opacity={0.4} side={THREE.DoubleSide} />
                        </Ring>
                        <Ring args={[GLOBE_RADIUS * 1.45, GLOBE_RADIUS * 1.455, 128]}>
                            <meshBasicMaterial color="#4f46e5" transparent opacity={0.2} side={THREE.DoubleSide} />
                        </Ring>
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                            <circleGeometry args={[GLOBE_RADIUS * 1.6, 64]} />
                            <meshBasicMaterial color="#00ffff" transparent opacity={0.02} side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                )}

                <GlobeInner
                    countryStabilities={countryStabilities}
                    isCollapsed={isCollapsed}
                    onCountryHover={onCountryHover}
                    onCountryClick={onCountryClick}
                    onSanction={onSanction}
                    setTooltip={setTooltip}
                    rotation={rotation}
                    onRotationChange={onRotationChange}
                    interactive={interactive}
                    highlightedEntities={highlightedEntities}
                    dataDrift={dataDrift}
                />

                {tooltip && <Tooltip data={tooltip} />}

                <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    enableDamping
                />
            </Canvas>

            {isCollapsed && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255, 0, 0, 0.2) 100%)' }} />
            )}
        </div>
    );
}

// Tactical Scanning Ring Component
function ScanningRing({ radius }: { radius: number }) {
    const ringRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ringRef.current) {
            // Constant upward motion
            const time = state.clock.getElapsedTime();
            ringRef.current.position.y = Math.sin(time * 0.5) * radius * 1.5;

            // Fade opacity at poles
            const y = Math.abs(ringRef.current.position.y);
            const opacity = 1 - (y / (radius * 1.5));
            const material = (ringRef.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
            material.opacity = Math.max(0, opacity * 0.1);
        }
    });

    return (
        <group ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <Ring args={[radius - 0.01, radius + 0.05, 64]}>
                <meshBasicMaterial color="#00ffff" transparent opacity={0.1} side={THREE.DoubleSide} />
            </Ring>
        </group>
    );
}

