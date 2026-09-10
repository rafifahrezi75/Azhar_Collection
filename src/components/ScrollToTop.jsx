import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Azhar Collection | Konveksi Seragam Sidoarjo',
  '/tentang-kami': 'Tentang Kami | Azhar Collection',
  '/layanan': 'Layanan Konveksi | Azhar Collection',
  '/katalog': 'Katalog Seragam | Azhar Collection',
  '/klien': 'Klien & Mitra | Azhar Collection',
  '/berita': 'Berita & Edukasi Busana | Azhar Collection',
  '/kontak': 'Kontak & Pemesanan | Azhar Collection'
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pageTitles[pathname]) {
      document.title = pageTitles[pathname]
    } else if (pathname.startsWith('/admin')) {
      document.title = 'Admin Panel | Azhar Collection'
    } else if (pathname.startsWith('/layanan/')) {
      document.title = 'Detail Layanan | Azhar Collection'
    } else if (pathname.startsWith('/katalog/')) {
      document.title = 'Detail Produk | Azhar Collection'
    } else if (pathname.startsWith('/klien/')) {
      document.title = 'Detail Klien | Azhar Collection'
    } else if (pathname.startsWith('/berita/')) {
      document.title = 'Artikel Busana | Azhar Collection'
    } else {
      document.title = 'Azhar Collection | Konveksi Seragam Sidoarjo'
    }

    if (hash) {
      const targetId = hash.replace('#', '')
      const timeoutId = setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 60)
      return () => clearTimeout(timeoutId)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

