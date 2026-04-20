import { useEffect, useState } from 'react'

export default function ScrollProgress(){
  const [pct, setPct] = useState(0)
  useEffect(()=>{
    const onScroll = ()=>{
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h>0 ? (window.scrollY / h) * 100 : 0
      setPct(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive:true })
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])
  return (
    <div aria-hidden className="fixed left-0 top-0 h-1 w-full z-50">
      <div style={{width: `${pct}%`}} className="h-1 bg-gradient-to-r from-neon to-cyan-400 transition-all" />
    </div>
  )
}
