import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import type { Group } from 'three'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function AuraObject({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (animate && group.current) {
      group.current.rotation.y += delta * 0.12
      group.current.rotation.x += delta * 0.04
    }
  })

  return (
    <Float speed={animate ? 1.1 : 0} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={group}>
        {/* Núcleo dourado translúcido */}
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshStandardMaterial
            color="#C9A24C"
            roughness={0.25}
            metalness={0.8}
            emissive="#8A6B25"
            emissiveIntensity={0.25}
            flatShading
          />
        </mesh>
        {/* Gaiola em wireframe (petróleo claro) */}
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#3E6B86" wireframe transparent opacity={0.35} />
        </mesh>
      </group>
    </Float>
  )
}

/** Cena 3D discreta para o cabeçalho do dashboard. Respeita reduced-motion. */
export function DashboardAura() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const animate = !reduceMotion

  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      frameloop={animate ? 'always' : 'demand'}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#F5E6C4" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#2F6F9E" />
      <AuraObject animate={animate} />
    </Canvas>
  )
}
