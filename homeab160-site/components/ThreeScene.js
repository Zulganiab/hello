import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function RotatingMesh(){
  const ref = useRef()
  useFrame((state, delta) => { if(ref.current) ref.current.rotation.y += delta * 0.4 })
  return (
    <mesh ref={ref} position={[0,0,0]}>
      <torusKnotGeometry args={[0.9,0.35,128,32]} />
      <MeshWobbleMaterial factor={0.6} speed={1.2} color="#00fff0" envMapIntensity={0.2} />
    </mesh>
  )
}

function Particles(){
  const ref = useRef()
  const { viewport, mouse } = useThree()
  const count = 600
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.02
    // subtle parallax with mouse
    ref.current.position.x = (mouse.x * viewport.width) * 0.03
    ref.current.position.y = (mouse.y * viewport.height) * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={'#00fff0'} opacity={0.65} transparent depthWrite={false} />
    </points>
  )
}

export default function ThreeScene(){
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ height: '360px', width: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5,5,5]} intensity={0.5} />
      <Particles />
      <RotatingMesh />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
    </Canvas>
  )
}
