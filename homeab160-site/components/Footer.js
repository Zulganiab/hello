export default function Footer(){
  return (
    <footer className="py-12 border-t border-white/6 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-bold text-lg">homeab160</div>
          <div className="text-white/70 text-sm">Luxury smart home systems</div>
        </div>
        <div className="flex gap-4 items-center">
          <input placeholder="Your email" className="px-4 py-2 rounded-full bg-white/5 border border-white/6 text-sm outline-none" />
          <button className="btn-primary">Subscribe</button>
        </div>
      </div>
    </footer>
  )
}
