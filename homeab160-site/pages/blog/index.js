import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { api } from '../../lib/api'

export default function Blog(){
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.getPosts().then(data=>{ setPosts(data || []); setLoading(false) }).catch(()=> setLoading(false))
  },[])

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        {loading && <p>Loading...</p>}
        {!loading && posts.length === 0 && <p>No posts yet.</p>}
        <div className="space-y-6">
          {posts.map(p=> (
            <article key={p.id} className="glass p-6 rounded-lg">
              <h2 className="text-2xl font-semibold"><Link href={`/blog/${p.id}`}>{p.title}</Link></h2>
              <p className="text-sm text-white/75">{p.groupName} • {new Date(p.createdAt).toLocaleDateString()}</p>
              <p className="mt-3 text-white/80">{p.content.slice(0, 240)}...</p>
              <div className="mt-3">
                <Link href={`/blog/${p.id}`} className="btn-ghost">Read more</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
