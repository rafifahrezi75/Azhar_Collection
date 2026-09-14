import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Azhar Collection | Konveksi Seragam Sidoarjo',
  '/tentang-kami': 'Tentang Kami | Azhar Collection',
  '/layanan': 'Layanan Konveksi | Azhar Collection',
  '/katalog': 'Katalog Seragam | Azhar Collection',
  '/klien': 'Klien & Mitra | Azhar Collection',
  '/galeri': 'Galeri Dokumentasi & Foto | Azhar Collection',
  '/berita': 'Galeri Dokumentasi & Foto | Azhar Collection',
  '/kontak': 'Kontak & Pemesanan | Azhar Collection'
}

const pageDescriptions = {
  '/': 'Azhar Collection - Produsen konveksi dan garment terpercaya di Buduran, Sidoarjo. Melayani seragam sekolah SD, SMP, SMA, pramuka, batik, kemeja PDH/PDL, almamater, kaos olahraga, dan bordir komputer.',
  '/tentang-kami': 'Profil dan perjalanan Azhar Collection sejak 2004 sebagai mitra konveksi seragam dan garment terpercaya di Sidoarjo dan Jawa Timur.',
  '/layanan': 'Layanan konveksi seragam sekolah, kemeja kerja PDH/PDL, batik instansi, jas almamater, dan bordir komputer otomatis di Sidoarjo.',
  '/katalog': 'Katalog portofolio busana dan seragam hasil produksi Azhar Collection untuk sekolah, instansi dinas, dan perusahaan.',
  '/klien': 'Daftar sekolah, instansi pemerintah, dan lembaga mitra yang mempercayakan pengadaan seragam kepada Azhar Collection.',
  '/galeri': 'Dokumentasi proses penjahitan seragam sekolah, pakaian dinas, bordir komputer, dan aktivitas workshop Azhar Collection di Buduran, Sidoarjo.',
  '/berita': 'Dokumentasi proses penjahitan seragam sekolah, pakaian dinas, bordir komputer, dan aktivitas workshop Azhar Collection di Buduran, Sidoarjo.',
  '/kontak': 'Hubungi Azhar Collection Sidoarjo untuk konsultasi pemesanan seragam kustom, kalkulasi biaya, dan survei workshop.'
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let title = 'Azhar Collection | Konveksi Seragam Sidoarjo'
    let description = pageDescriptions['/']

    if (pageTitles[pathname]) {
      title = pageTitles[pathname]
      description = pageDescriptions[pathname] || description
    } else if (pathname.startsWith('/admin')) {
      title = 'Admin Panel | Azhar Collection'
      description = 'Panel administrasi internal Azhar Collection'
    } else if (pathname.startsWith('/layanan/')) {
      title = 'Detail Layanan | Azhar Collection'
      description = 'Informasi spesifikasi layanan jahit dan konveksi busana Azhar Collection.'
    } else if (pathname.startsWith('/katalog/')) {
      title = 'Detail Produk | Azhar Collection'
      description = 'Detail model dan spesifikasi produk seragam pesanan kustom Azhar Collection.'
    } else if (pathname.startsWith('/klien/')) {
      title = 'Detail Klien | Azhar Collection'
      description = 'Informasi profil dan kerja sama mitra dengan Azhar Collection.'
    } else if (pathname.startsWith('/berita/')) {
      title = 'Artikel Busana | Azhar Collection'
      description = 'Baca panduan bahan pakaian, pengadaan seragam, dan info konveksi terkini.'
    }

    document.title = title

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', description)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    }

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) {
      ogDesc.setAttribute('content', description)
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

