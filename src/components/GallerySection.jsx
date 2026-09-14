import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getGalleryList } from '../firebase/adminService'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

export default function GallerySection() {
  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(5)
  const autoPlayRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    getGalleryList().then((data) => {
      if (isMounted && data) {
        setItems(data.slice(0, 8))
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1200) {
        setSlidesToShow(5)
      } else if (width >= 992) {
        setSlidesToShow(4)
      } else if (width >= 768) {
        setSlidesToShow(3)
      } else if (width >= 480) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, items.length - slidesToShow)

  const handleNext = useCallback(() => {
    if (items.length <= slidesToShow) return
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [items.length, slidesToShow, maxIndex])

  const handlePrev = useCallback(() => {
    if (items.length <= slidesToShow) return
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [items.length, slidesToShow, maxIndex])

  useEffect(() => {
    if (items.length <= slidesToShow || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      return
    }

    autoPlayRef.current = setInterval(() => {
      handleNext()
    }, 3000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [items.length, slidesToShow, isHovered, handleNext])

  if (items.length === 0) {
    return null
  }

  const slideWidthPercent = 100 / slidesToShow
  const translateX = currentIndex * slideWidthPercent

  return (
    <section
      className="gallery-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        <div className="section-header-flex">
          <div>
            <span className="section-tag">DOKUMENTASI & GALERI</span>
            <h2 className="section-title">Galeri Foto Produksi</h2>
            <p className="section-subtitle">
              Dokumentasi pengerjaan seragam sekolah, pakaian dinas, dan proses bordir komputer di workshop Azhar Collection.
            </p>
          </div>

          <div className="gallery-header-actions">
            <div className="gallery-nav-buttons">
              <button
                type="button"
                className="gallery-nav-btn"
                onClick={handlePrev}
                aria-label="Sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="gallery-nav-btn"
                onClick={handleNext}
                aria-label="Selanjutnya"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Link to="/galeri" className="btn-outline-primary">
              <span>Lihat Semua</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="gallery-carousel-viewport">
          <div
            className="gallery-carousel-track"
            style={{
              transform: `translateX(-${translateX}%)`,
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="gallery-carousel-slide"
                style={{ flex: `0 0 ${slideWidthPercent}%`, maxWidth: `${slideWidthPercent}%` }}
              >
                <div className="gallery-card">
                  <div className="gallery-card-img-wrap">
                    <img
                      src={item.image}
                      alt={item.date ? `Foto dokumentasi ${item.date}` : 'Foto galeri'}
                      className="gallery-card-img"
                      loading="lazy"
                    />
                    {item.date && (
                      <span className="gallery-card-date-badge">{item.date}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
