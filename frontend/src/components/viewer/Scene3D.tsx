import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import type { FurnitureItem, Room } from '../../data/mockData';
const SCALE = 1 / 80; // Convert 2D pixels to 3D units (roughly)
interface RoomMeshProps {
  room: Room;
}
function RoomMesh({ room }: RoomMeshProps) {
  const w = room.width;
  const l = room.length;
  const h = room.height;
  const wallColor = room.wallColor;
  const wallThickness = 0.08;
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial
          color={
          room.floorMaterial === 'Wood' ?
          '#C4A882' :
          room.floorMaterial === 'Carpet' ?
          '#9CA3AF' :
          room.floorMaterial === 'Tile' ?
          '#E5E7EB' :
          room.floorMaterial === 'Marble' ?
          '#F1F5F9' :
          '#D1D5DB'
          }
          roughness={room.floorMaterial === 'Marble' ? 0.2 : 0.8} />

      </mesh>

      {/* Back wall */}
      <mesh position={[0, h / 2, -l / 2 - wallThickness / 2]} receiveShadow>
        <boxGeometry args={[w + wallThickness * 2, h, wallThickness]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, h / 2, l / 2 + wallThickness / 2]} receiveShadow>
        <boxGeometry args={[w + wallThickness * 2, h, wallThickness]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-w / 2 - wallThickness / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, h, l]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[w / 2 + wallThickness / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, h, l]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide} />
      </mesh>
    </group>);

}
interface FurnitureBoxProps {
  item: FurnitureItem;
  roomWidth: number;
  roomLength: number;
}

// Specialized Furniture Components
function ChairModel({ color, w, d, h }: { color: string; w: number; d: number; h: number }) {
  const legW = 0.04;
  const seatH = 0.04;
  const legH = h / 2 - seatH / 2;
  
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, legH + seatH / 2, 0]}>
        <boxGeometry args={[w, seatH, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, legH + h / 4 + seatH, -d / 2 + 0.02]}>
        <boxGeometry args={[w, h / 2, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([xs, zs], i) => (
        <mesh key={i} position={[(w / 2 - legW / 2) * xs, legH / 2, (d / 2 - legW / 2) * zs]}>
          <boxGeometry args={[legW, legH, legW]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function SofaModel({ color, w, d, h }: { color: string; w: number; d: number; h: number }) {
  const baseH = h * 0.4;
  const armW = 0.15;
  const backD = 0.15;
  
  return (
    <group>
      {/* Base/Seat */}
      <mesh position={[0, baseH / 2, 0]}>
        <boxGeometry args={[w - armW * 2, baseH, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, h / 2 + baseH / 4, -d / 2 + backD / 2]}>
        <boxGeometry args={[w, h - baseH / 2, backD]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Armrests */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[(w / 2 - armW / 2) * s, baseH * 0.75, 0]}>
          <boxGeometry args={[armW, baseH * 1.5, d]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function TableModel({ color, w, d, h, isSide }: { color: string; w: number; d: number; h: number; isSide?: boolean }) {
  const topH = 0.04;
  const legW = isSide ? 0.03 : 0.06;
  const legH = h - topH;
  
  return (
    <group>
      {/* Top */}
      <mesh position={[0, h - topH / 2, 0]}>
        <boxGeometry args={[w, topH, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([xs, zs], i) => (
        <mesh key={i} position={[(w / 2 - legW * 1.5) * xs, legH / 2, (d / 2 - legW * 1.5) * zs]}>
          <boxGeometry args={[legW, legH, legW]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function BedModel({ color, w, d }: { color: string; w: number; d: number }) {
  const frameH = 0.15;
  const mattressH = 0.2;
  const headboardH = 0.8;
  
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, frameH / 2, 0]}>
        <boxGeometry args={[w, frameH, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, frameH + mattressH / 2, 0]}>
        <boxGeometry args={[w - 0.05, mattressH, d - 0.05]} />
        <meshStandardMaterial color="#FFFFFF" roughness={1} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, headboardH / 2, -d / 2 + 0.025]}>
        <boxGeometry args={[w, headboardH, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function WardrobeModel({ color, w, d, h }: { color: string; w: number; d: number; h: number }) {
  return (
    <group>
      {/* Main Body */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Door Lines */}
      <mesh position={[0, h / 2, d / 2 + 0.001]}>
        <boxGeometry args={[0.01, h - 0.1, 0.001]} />
        <meshStandardMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
      {/* Handles */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[0.1 * s, h / 2, d / 2 + 0.01]}>
          <boxGeometry args={[0.02, 0.2, 0.02]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function FurnitureBox({ item, roomWidth, roomLength }: FurnitureBoxProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  const boxW = item.width;
  const boxH = item.depth; // depth becomes height in 3D
  const boxD = item.height; // height becomes depth in 3D

  // Convert 2D position (top-left) to 3D world coordinates (center)
  const offsetX = -roomWidth / 2 + item.position.x * SCALE + boxW / 2;
  const offsetZ = -roomLength / 2 + item.position.y * SCALE + boxD / 2;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.degToRad(-item.rotation);
    }
  });

  const renderModel = () => {
    const props = { color: item.color, w: boxW, d: boxD, h: boxH };
    
    switch (item.type) {
      case 'Chair':
        return <ChairModel {...props} h={0.9} w={0.5} d={0.5} />;
      case 'Sofa':
        return <SofaModel {...props} h={0.8} />;
      case 'Dining Table':
        return <TableModel {...props} h={0.75} />;
      case 'Side Table':
        return <TableModel {...props} isSide h={0.5} />;
      case 'Bed':
        return <BedModel color={item.color} w={boxW} d={boxD} />;
      case 'Wardrobe':
        return <WardrobeModel {...props} />;
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[boxW, boxH, boxD]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef} position={[offsetX, 0, offsetZ]}>
      {renderModel()}
    </group>
  );
}
interface Scene3DProps {
  room: Room | null;
  furnitureItems: FurnitureItem[];
  wireframe?: boolean;
}
export function Scene3D({ room, furnitureItems, wireframe }: Scene3DProps) {
  const defaultRoom: Room = {
    id: 'default',
    name: 'Room',
    width: 6,
    length: 5,
    height: 3,
    wallColor: '#F5F5F5',
    floorMaterial: 'Wood',
    createdAt: ''
  };
  const activeRoom = room ?? defaultRoom;
  return (
    <Canvas
      shadows
      camera={{
        position: [
        activeRoom.width * 1.2,
        activeRoom.height * 1.5,
        activeRoom.length * 1.2],

        fov: 50,
        near: 0.1,
        far: 100
      }}
      className="w-full h-full"
      gl={{
        antialias: true
      }}>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10} />

      <pointLight position={[-3, 4, -3]} intensity={0.3} color="#E0E7FF" />

      {/* Environment */}
      <Environment preset="apartment" />

      {/* Room */}
      <RoomMesh room={activeRoom} />

      {/* Furniture */}
      {furnitureItems.map((item) =>
      <FurnitureBox
        key={item.id}
        item={item}
        roomWidth={activeRoom.width}
        roomLength={activeRoom.length} />

      )}

      {/* Grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#94A3B8"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#64748B"
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid />


      {/* Controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 0.5, 0]} />


      {/* Wireframe override */}
      {wireframe &&
      <group>
          {/* This is handled via material props in a real app, but for simplicity we skip */}
        </group>
      }
    </Canvas>);

}