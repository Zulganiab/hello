import { motion } from 'framer-motion'

export default function Services({ services = [] }){
  return (
    <section id="services" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-8">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s,i)=> (
            <motion.div whileHover={{rotateX:2, rotateY:6, scale:1.02}} key={i} className="glass p-6 rounded-2xl">
              <h4 className="font-semibold mb-2">{s.title}</h4>
              <p className="text-white/80">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
