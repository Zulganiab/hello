import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function ProjectManager(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title:'', description:'', image:'', glbUrl:'' })

  useEffect(()=>{ load() },[])
  async function load(){ try{ const d = await api.getProjects(); setItems(d||[]) }catch(e){} }

  async function create(e){ e.preventDefault(); try{ await api.createProject(form); setForm({ title:'', description:'', image:'', glbUrl:'' }); load() }catch(err){ alert(err.message) } }
  async function del(id){ if(!confirm('Delete project?')) return; try{ await api.deleteProject(id); load() }catch(err){ alert(err.message) } }

  return (
    <div>
      <form onSubmit={create} className="space-y-3 mb-4">
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full p-2 rounded bg-black/30" />
        <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" className="w-full p-2 rounded bg-black/30" />
        <input value={form.glbUrl} onChange={e=>setForm({...form,glbUrl:e.target.value})} placeholder="GLB URL (optional)" className="w-full p-2 rounded bg-black/30" />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="w-full p-2 rounded bg-black/30" />
        <button className="btn-primary">Create Project</button>
      </form>
      <div className="space-y-3">
        {items.map(i=> (
          <div key={i.id} className="p-3 bg-black/20 rounded flex justify-between">
            <div>
              <div className="font-semibold">{i.title}</div>
              <div className="text-sm text-white/70">{new Date(i.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>location.href=`/blog/${i.id}`} className="btn-ghost">View</button>
              <button onClick={()=>del(i.id)} className="btn-ghost">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
