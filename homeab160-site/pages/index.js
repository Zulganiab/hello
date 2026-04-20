import Head from 'next/head'
import fs from 'fs/promises'
import path from 'path'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import About from '../components/About'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'

export default function Home({ data }){
  const meta = data.site || {}
  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Navbar />
      <main>
        <Hero />
        <Features features={data.features} />
        <Services services={data.services} />
        <About />
        <Portfolio />
        <Testimonials testimonials={data.testimonials} />
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps(){
  const file = path.join(process.cwd(), 'data', 'site.json')
  const raw = await fs.readFile(file, 'utf8')
  const data = JSON.parse(raw)
  return { props: { data } }
}
