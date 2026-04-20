import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false })

export default function Hero(){
  return (
    <header className="min-h-screen hero-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#001] to-[#000]"></div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
        <motion.h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.8}}>Reimagine Home Automation</motion.h1>
        <motion.p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto mb-8" initial={{y:10,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}}>Luxury-grade smart home solutions for a connected, effortless living experience.</motion.p>
        <div className="flex gap-4 justify-center">
          <motion.button whileHover={{scale:1.03}} className="btn-primary">Get Started</motion.button>
          <motion.a whileHover={{scale:1.02}} href="#features" className="btn-ghost">See Features</motion.a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 -z-0">
        <ThreeScene />
      </div>

      <div className="absolute right-12 top-24 w-48 h-48 rounded-full neon floating-3d opacity-80" style={{transform:'translateZ(40px)'}} />
    </header>
  )
}
