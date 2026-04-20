import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About({ illustrationSrc = '/images/illustration.svg' }){
  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{x:-20,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} className="space-y-4">
          <h3 className="text-3xl font-bold">About homeab160</h3>
          <p className="text-white/80">We design premium smart home experiences blending privacy, performance, and beautiful hardware. Our products are engineered to feel effortless and timeless.</p>
          <ul className="mt-4 space-y-2 text-white/70">
            <li>• Elegant hardware and refined software</li>
            <li>• Local-first privacy model</li>
            <li>• Seamless integrations</li>
          </ul>
        </motion.div>
        <motion.div initial={{x:20,opacity:0}} whileInView={{x:0,opacity:1}} viewport={{once:true}} className="flex justify-center">
          <div className="w-72 h-56 relative">
            <Image src={illustrationSrc} alt="Product illustration" fill style={{objectFit:'cover'}} priority={false} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
