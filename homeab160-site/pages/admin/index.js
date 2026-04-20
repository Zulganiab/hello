import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProjectManager from '../../components/ProjectManager'
import MemberManager from '../../components/MemberManager'
import { api } from '../../lib/api'

export default function Admin(){
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title:'', content:'', groupId:'' })
  const [loginForm, setLoginForm] = useState({ username:'', password:'' })

  useEffect(()=>{ loadPosts() }, [])

  async function loadPosts(){
    setLoading(true)
    try{ const data = await api.getPosts(); setPosts(data || []) }catch(e){}
    setLoading(false)
  }

  async function handleLogin(e){
    e.preventDefault()
    try{
      await api.adminLogin(loginForm.username, loginForm.password)
      setLoggedIn(true)
    }catch(err){ alert(err.message) }
  }

  async function handleCreate(e){
    e.preventDefault()
    try{ await api.createPost(form); setForm({ title:'', content:'', groupId:''}); loadPosts() }catch(err){ alert(err.message) }
  }

  async function handleDelete(id){
    if(!confirm('Delete post?')) return
    try{ await api.deletePost(id); loadPosts() }catch(err){ alert(err.message) }
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

        {!loggedIn && (
          <section className="glass p-6 rounded mb-6">
            <h2 className="mb-3">Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <input value={loginForm.username} onChange={(e)=>setLoginForm({...loginForm, username:e.target.value})} placeholder="username" className="w-full p-2 bg-black/30 rounded" />
              <input type="password" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm, password:e.target.value})} placeholder="password" className="w-full p-2 bg-black/30 rounded" />
              <button className="btn-primary">Login</button>
            </form>
            <p className="mt-3 text-sm text-white/70">Founder: Zulgani Abdiji (username: zulgani)</p>
          </section>
        )}

        {loggedIn && (
          <section className="space-y-6">
            <div className="glass p-6 rounded">
              <h2>Create Post</h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full p-2 bg-black/30 rounded" />
                <textarea value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})} placeholder="Content" className="w-full p-2 bg-black/30 rounded" />
                <input value={form.groupId} onChange={(e)=>setForm({...form,groupId:e.target.value})} placeholder="Group ID" className="w-full p-2 bg-black/30 rounded" />
                <button className="btn-primary">Create</button>
              </form>
            </div>

            <div className="glass p-6 rounded">
              <h2>All Posts</h2>
              {loading && <p>Loading...</p>}
              <div className="space-y-3 mt-3">
                {posts.map(p => (
                  <div key={p.id} className="p-3 bg-black/20 rounded flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-white/70">{p.groupName} • {new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>location.href=`/blog/${p.id}`} className="btn-ghost">View</button>
                      <button onClick={()=>handleDelete(p.id)} className="btn-ghost">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
            <div className="glass p-6 rounded">
              <h2>Projects</h2>
              <ProjectManager />
            </div>

            <div className="glass p-6 rounded">
              <h2>Members</h2>
              <MemberManager />
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  )
}
