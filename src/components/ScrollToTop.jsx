import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Azhar Collection | Konveksi Pakaian Sidoarjo & Sablon DTF',
  '/tentang-kami': 'Tentang Kami | Konveksi Pakaian Sidoarjo - Azhar Collection',
  '/layanan': 'Layanan Konveksi Pakaian, Sablon DTF & Bordir | Azhar Collection',
  '/katalog': 'Katalog Seragam Sekolah & Kemeja PDH | Azhar Collection Sidoarjo',
  '/klien': 'Klien & Mitra Pengadaan Seragam | Azhar Collection Sidoarjo',
  '/galeri': 'Galeri Workshop Konveksi & Bordir Komputer | Azhar Collection',
  '/berita': 'Galeri Workshop Konveksi & Bordir Komputer | Azhar Collection',
  '/kontak': 'Kontak & Alamat Workshop Konveksi Buduran | Azhar Collection Sidoarjo'
}

const pageDescriptions = {
  '/': 'Azhar Collection - Produsen konveksi pakaian terpercaya di Buduran, Sidoarjo. Melayani seragam sekolah SD, SMP, SMA, pramuka, batik, kemeja PDH/PDL, almamater, kaos olahraga, sablon DTF, dan bordir komputer.',
  '/tentang-kami': 'Profil dan sejarah Azhar Collection sejak 2004 sebagai mitra konveksi pakaian terpercaya di Sidoarjo dan Jawa Timur dengan kapasitas produksi 1.000 stel per order.',
  '/layanan': 'Layanan jahit kustom konveksi pakaian, seragam olahraga, sablon digital DTF presisi, bordir komputer otomatis, dan pakaian dinas kustom di Sidoarjo.',
  '/katalog': 'Katalog model kemeja PDH/PDL, seragam sekolah SD SMP SMA, jas almamater, batik sekolah, dan busana muslim hasil produksi konveksi Azhar Collection Sidoarjo.',
  '/klien': 'Daftar sekolah, instansi pemerintah, dan lembaga mitra yang mempercayakan pengadaan seragam dan pakaian dinas kepada Azhar Collection Sidoarjo.',
  '/galeri': 'Dokumentasi workshop penjahitan seragam sekolah, pakaian dinas, mesin bordir komputer, dan aktivitas produksi Azhar Collection di Buduran, Sidoarjo.',
  '/berita': 'Dokumentasi workshop penjahitan seragam sekolah, pakaian dinas, mesin bordir komputer, dan aktivitas produksi Azhar Collection di Buduran, Sidoarjo.',
  '/kontak': 'Hubungi Azhar Collection di Damarsi Buduran Sidoarjo untuk konsultasi pemesanan jahit seragam kustom, kalkulasi biaya, dan survei workshop.'
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let title = 'Azhar Collection | Konveksi Pakaian Sidoarjo'
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

    const pageUrl = `https://azharcollection.my.id${pathname === '/' ? '/' : pathname}`
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) {
      canonicalLink.setAttribute('href', pageUrl)
    }

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', pageUrl)
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

