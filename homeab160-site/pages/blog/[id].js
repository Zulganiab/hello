import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { api } from '../../lib/api'

export default function PostPage(){
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  useEffect(()=>{
    if(!id) return
    api.getPost(id).then(setPost).catch(()=>{})
    api.getComments(id).then(setComments).catch(()=>{})
  },[id])

  async function submitComment(e){
    e.preventDefault()
    if(!commentText) return
    try{
      await api.createComment({ postId: id, text: commentText })
      setCommentText('')
      const updated = await api.getComments(id)
      setComments(updated)
    }catch(err){
      alert(err.message)
    }
  }

  if(!post) return (<div><Navbar /><main className="p-6">Loading...</main><Footer/></div>)

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <article className="glass p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-white/70 mb-4">{post.groupName} • {new Date(post.createdAt).toLocaleString()}</p>
          <div className="prose text-white/80"><p>{post.content}</p></div>
        </article>

        <section className="mt-8">
          <h3 className="text-2xl mb-3">Comments</h3>
          <div className="space-y-4">
            {comments.map(c=> (
              <div key={c.id} className="glass p-4 rounded">
                <p className="text-white/85">{c.text}</p>
                <div className="text-sm text-white/60">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <form onSubmit={submitComment} className="mt-4">
            <textarea value={commentText} onChange={(e)=>setCommentText(e.target.value)} className="w-full p-3 rounded bg-black/40" placeholder="Write a comment..." />
            <div className="mt-2 flex gap-2">
              <button className="btn-primary" type="submit">Post Comment</button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}
