import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import PortfolioPage from './pages/PortfolioPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ClientsPage from './pages/ClientsPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLayout from './admin/layouts/AdminLayout'
import AdminLoginPage from './admin/pages/AdminLoginPage'
import AdminDashboardPage from './admin/pages/AdminDashboardPage'
import AdminKatalogPage from './admin/pages/AdminKatalogPage'
import AdminKatalogCreatePage from './admin/pages/AdminKatalogCreatePage'
import AdminKatalogEditPage from './admin/pages/AdminKatalogEditPage'
import AdminKatalogDetailPage from './admin/pages/AdminKatalogDetailPage'
import AdminKlienPage from './admin/pages/AdminKlienPage'
import AdminKlienCreatePage from './admin/pages/AdminKlienCreatePage'
import AdminKlienEditPage from './admin/pages/AdminKlienEditPage'
import AdminKlienDetailPage from './admin/pages/AdminKlienDetailPage'
import AdminLayananPage from './admin/pages/AdminLayananPage'
import AdminLayananCreatePage from './admin/pages/AdminLayananCreatePage'
import AdminLayananEditPage from './admin/pages/AdminLayananEditPage'
import AdminLayananDetailPage from './admin/pages/AdminLayananDetailPage'
import AdminBeritaPage from './admin/pages/AdminBeritaPage'
import AdminBeritaCreatePage from './admin/pages/AdminBeritaCreatePage'
import AdminBeritaEditPage from './admin/pages/AdminBeritaEditPage'
import AdminBeritaDetailPage from './admin/pages/AdminBeritaDetailPage'
import AdminPesanPage from './admin/pages/AdminPesanPage'
import AdminPesanDetailPage from './admin/pages/AdminPesanDetailPage'
import AdminTestimoniPage from './admin/pages/AdminTestimoniPage'
import AdminTestimoniCreatePage from './admin/pages/AdminTestimoniCreatePage'
import AdminTestimoniEditPage from './admin/pages/AdminTestimoniEditPage'
import AdminTestimoniDetailPage from './admin/pages/AdminTestimoniDetailPage'
import { useEffect } from 'react'
import AdminPengaturanPage from './admin/pages/AdminPengaturanPage'
import { trackPublicVisit } from './firebase/visitorService'

function PublicLayout({ onOpenQuote }) {
  useEffect(() => {
    trackPublicVisit()
  }, [])

  return (
    <div className="app-root">
      <Navbar onOpenQuote={onOpenQuote} />
      <main>
        <Outlet />
      </main>
      <Footer onOpenQuote={onOpenQuote} />
    </div>
  )
}

export default function App() {
  const handleOpenWhatsAppQuote = () => {
    const text = 'Halo Pak Haris Azhar Collection, saya ingin konsultasi mengenai pemesanan busana dan seragam.'
    window.open(`https://wa.me/6281330666807?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="katalog" element={<AdminKatalogPage />} />
          <Route path="katalog/tambah" element={<AdminKatalogCreatePage />} />
          <Route path="katalog/create" element={<AdminKatalogCreatePage />} />
          <Route path="katalog/edit/:id" element={<AdminKatalogEditPage />} />
          <Route path="katalog/detail/:id" element={<AdminKatalogDetailPage />} />
          <Route path="klien" element={<AdminKlienPage />} />
          <Route path="klien/tambah" element={<AdminKlienCreatePage />} />
          <Route path="klien/create" element={<AdminKlienCreatePage />} />
          <Route path="klien/edit/:id" element={<AdminKlienEditPage />} />
          <Route path="klien/detail/:id" element={<AdminKlienDetailPage />} />
          <Route path="layanan" element={<AdminLayananPage />} />
          <Route path="layanan/tambah" element={<AdminLayananCreatePage />} />
          <Route path="layanan/create" element={<AdminLayananCreatePage />} />
          <Route path="layanan/edit/:id" element={<AdminLayananEditPage />} />
          <Route path="layanan/detail/:id" element={<AdminLayananDetailPage />} />
          <Route path="berita" element={<AdminBeritaPage />} />
          <Route path="berita/tambah" element={<AdminBeritaCreatePage />} />
          <Route path="berita/create" element={<AdminBeritaCreatePage />} />
          <Route path="berita/edit/:id" element={<AdminBeritaEditPage />} />
          <Route path="berita/detail/:id" element={<AdminBeritaDetailPage />} />
          <Route path="pesan" element={<AdminPesanPage />} />
          <Route path="pesan/detail/:id" element={<AdminPesanDetailPage />} />
          <Route path="testimoni" element={<AdminTestimoniPage />} />
          <Route path="testimoni/tambah" element={<AdminTestimoniCreatePage />} />
          <Route path="testimoni/create" element={<AdminTestimoniCreatePage />} />
          <Route path="testimoni/edit/:id" element={<AdminTestimoniEditPage />} />
          <Route path="testimoni/detail/:id" element={<AdminTestimoniDetailPage />} />
          <Route path="pengaturan" element={<AdminPengaturanPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<PublicLayout onOpenQuote={handleOpenWhatsAppQuote} />}>
          <Route
            path="/"
            element={<HomePage onOpenQuote={handleOpenWhatsAppQuote} />}
          />
          <Route path="/tentang-kami" element={<AboutPage />} />
          <Route path="/layanan" element={<ServicesPage />} />
          <Route path="/layanan/:slug" element={<ServiceDetailPage />} />
          <Route path="/katalog" element={<PortfolioPage />} />
          <Route path="/katalog/:productId" element={<ProductDetailPage />} />
          <Route path="/portofolio" element={<PortfolioPage />} />
          <Route path="/portofolio/:productId" element={<ProductDetailPage />} />
          <Route path="/klien" element={<ClientsPage />} />
          <Route
            path="/klien/:clientId"
            element={<Navigate to="/klien" replace />}
          />
          <Route path="/berita" element={<NewsPage />} />
          <Route
            path="/berita/:slug"
            element={<NewsDetailPage />}
          />
          <Route path="/kontak" element={<ContactPage />} />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
