import { motion } from 'framer-motion'

export default function Testimonials({ testimonials = [] }){
  const items = testimonials || []
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-8 text-center">What customers say</h3>
        <div className="flex gap-6 overflow-x-auto py-4">
          {items.map((t,i)=> (
            <motion.div key={i} whileHover={{scale:1.02}} className="min-w-[260px] glass p-6 rounded-2xl">
              <p className="text-white/80 mb-4">“{t.text}”</p>
              <div className="text-sm text-white/70">— {t.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
