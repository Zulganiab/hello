import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function MemberManager(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name:'', role:'', avatar:'' })

  useEffect(()=>{ load() },[])
  async function load(){ try{ const d = await api.getMembers(); setItems(d||[]) }catch(e){} }

  async function create(e){ e.preventDefault(); try{ await api.addMember(form); setForm({ name:'', role:'', avatar:'' }); load() }catch(err){ alert(err.message) } }
  async function del(id){ if(!confirm('Delete member?')) return; try{ await api.deleteMember(id); load() }catch(err){ alert(err.message) } }

  return (
    <div>
      <form onSubmit={create} className="space-y-3 mb-4">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full p-2 rounded bg-black/30" />
        <input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Role" className="w-full p-2 rounded bg-black/30" />
        <input value={form.avatar} onChange={e=>setForm({...form,avatar:e.target.value})} placeholder="Avatar URL" className="w-full p-2 rounded bg-black/30" />
        <button className="btn-primary">Create Member</button>
      </form>
      <div className="space-y-3">
        {items.map(i=> (
          <div key={i.id} className="p-3 bg-black/20 rounded flex justify-between">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-white/70">{i.role}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>del(i.id)} className="btn-ghost">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
