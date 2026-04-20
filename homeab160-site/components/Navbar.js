import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export default function Navbar(){
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(()=>{
    const onScroll = ()=> setSolid(window.scrollY>24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  useEffect(()=>{
    function onKey(e){
      if(!open) return
      if(e.key === 'Escape') setOpen(false)
      if(e.key === 'Tab'){
        // very small focus trap: keep focus inside menu
        const focusable = menuRef.current?.querySelectorAll('a,button,input') || []
        if(focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length -1]
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault()
          last.focus()
        } else if(!e.shiftKey && document.activeElement === last){
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  },[open])

  useEffect(()=>{
    if(open){
      // focus first link when opening
      setTimeout(()=> firstLinkRef.current?.focus(), 50)
    }
  },[open])

  return (
    <nav className={`fixed w-full z-50 transition-colors ${solid? 'bg-black/70 backdrop-blur-md border-b border-white/6' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold tracking-wide">homeab160</div>
        <div className="hidden md:flex gap-6 items-center">
          <a className="hover:underline" href="#features">Features</a>
          <a className="hover:underline" href="#services">Services</a>
          <a className="hover:underline" href="#about">About</a>
          <a className="hover:underline" href="#contact">Contact</a>
          <button className="btn-primary">Get Started</button>
        </div>

        <div className="md:hidden flex items-center">
          <button aria-haspopup="true" aria-expanded={open} aria-controls="mobile-menu" aria-label="menu" onClick={()=>setOpen(v=>!v)} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
              <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" role="dialog" aria-modal={open} className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm ${open? '' : 'pointer-events-none'}`}>
        <div ref={menuRef} className={`absolute right-0 w-64 h-full bg-black/80 p-6 mobile-menu ${open? 'visible' : 'hidden'}`}>
          <button onClick={()=>setOpen(false)} className="mb-6">Close</button>
          <nav className="flex flex-col gap-4">
            <a ref={firstLinkRef} href="#features" onClick={()=>setOpen(false)}>Features</a>
            <a href="#services" onClick={()=>setOpen(false)}>Services</a>
            <a href="#about" onClick={()=>setOpen(false)}>About</a>
            <a href="#contact" onClick={()=>setOpen(false)}>Contact</a>
            <button className="btn-primary mt-4">Get Started</button>
          </nav>
        </div>
      </div>
    </nav>
  )
}
