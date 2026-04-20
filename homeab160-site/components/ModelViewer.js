import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model({ url }){
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.4} />
}

export default function ModelViewer({ url }){
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5,5,5]} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls enablePan={true} enableZoom={true} />
    </Canvas>
  )
}
