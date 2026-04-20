import { motion } from 'framer-motion'

export default function Features({ features = [] }){
  const cards = features || []
  return (
    <section id="features" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-8">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c,i)=> (
            <motion.div key={i} whileHover={{y:-6, boxShadow:'0 20px 60px rgba(0,255,240,0.06)'}} className="glass p-6 rounded-2xl transition-transform">
              <div className="text-4xl mb-4">{c.icon}</div>
              <h4 className="font-semibold mb-2">{c.title}</h4>
              <p className="text-sm text-white/75">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
