import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { api } from '../lib/api'

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false })

export default function Portfolio(){
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(()=>{ api.getProjects().then(setProjects).catch(()=>{}) },[])

  return (
    <section id="portfolio" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-8">Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(p=> (
            <div key={p.id} className="glass p-4 rounded-2xl cursor-pointer" onClick={()=>setSelected(p)}>
              <div className="h-40 w-full relative mb-3">
                {p.image ? <Image src={p.image} alt={p.title} fill style={{objectFit:'cover'}} /> : <div className="bg-black/20 h-full" />}
              </div>
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-sm text-white/70">{p.description.slice(0,120)}</p>
            </div>
          ))}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60" onClick={()=>setSelected(null)} />
            <div className="relative w-full max-w-4xl bg-black/80 p-6 glass rounded">
              <button className="absolute right-4 top-4" onClick={()=>setSelected(null)}>Close</button>
              <h3 className="text-2xl mb-3">{selected.title}</h3>
              <p className="text-white/80 mb-4">{selected.description}</p>
              <div className="w-full h-96 bg-black">
                {selected.glbUrl ? (
                  <ModelViewer url={selected.glbUrl} />
                ) : (
                  selected.image ? <Image src={selected.image} alt={selected.title} width={800} height={400} style={{objectFit:'cover'}} /> : <div className="h-full" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
