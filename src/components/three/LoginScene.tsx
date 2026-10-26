import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import type { Group } from 'three'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function Centerpiece({ animate }: { animate: boolean }) {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!animate) return
    if (outer.current) outer.current.rotation.y += delta * 0.08
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.14
      inner.current.rotation.x += delta * 0.05
    }
  })

  return (
    <Float speed={animate ? 1 : 0} rotationIntensity={0.3} floatIntensity={0.7}>
      {/* Núcleo dourado facetado */}
      <group ref={inner}>
        <mesh>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color="#C9A24C"
            roughness={0.2}
            metalness={0.9}
            emissive="#8A6B25"
            emissiveIntensity={0.3}
            flatShading
          />
        </mesh>
      </group>

      {/* Cascas em wireframe (petróleo) */}
      <group ref={outer}>
        <mesh scale={1.7}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#4E7C97" wireframe transparent opacity={0.28} />
        </mesh>
        <mesh scale={2.35}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#2F5A73" wireframe transparent opacity={0.16} />
        </mesh>
      </group>
    </Float>
  )
}

/** Cena 3D imersiva porém discreta para o painel do login. */
export function LoginScene() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const animate = !reduceMotion

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      frameloop={animate ? 'always' : 'demand'}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <fog attach="fog" args={['#0A1622', 6, 13]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} color="#F5E6C4" />
      <directionalLight position={[-5, -3, -4]} intensity={0.6} color="#2F6F9E" />
      <spotLight position={[0, 6, 3]} angle={0.5} penumbra={1} intensity={0.6} color="#C9A24C" />

      <Centerpiece animate={animate} />

      {/* Poeira dourada suave */}
      <Sparkles
        count={70}
        scale={[9, 7, 5]}
        size={2.4}
        speed={animate ? 0.28 : 0}
        opacity={0.55}
        color="#D8B968"
      />
      <Sparkles
        count={40}
        scale={[10, 8, 4]}
        size={1.2}
        speed={animate ? 0.18 : 0}
        opacity={0.35}
        color="#9FC2D6"
      />
    </Canvas>
  )
}
