import '../styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'
import Lenis from '@studio-freight/lenis'
import ScrollProgress from '../components/ScrollProgress'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')

    // Lenis smooth scroll
    const lenis = new Lenis({ duration: 1.2, smooth: true })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      // no-op cleanup for now
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>homeab160.uk</title>
      </Head>
      <ScrollProgress />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
