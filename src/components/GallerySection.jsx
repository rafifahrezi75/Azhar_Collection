import { useState, useEffect, useRef, useCallback } from 'react'
import { getGalleryList } from '../firebase/adminService'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function GallerySection() {
  const [rawItems, setRawItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(4)
  const autoPlayRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    getGalleryList().then((data) => {
      if (isMounted && data) {
        setRawItems(data.slice(0, 5))
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
        setSlidesToShow(4)
      } else if (width >= 992) {
        setSlidesToShow(3)
      } else if (width >= 640) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  let items = []
  if (rawItems.length > 0) {
    let count = 0
    while (items.length < 5) {
      const it = rawItems[count % rawItems.length]
      items.push({
        ...it,
        uniqueKey: `${it.id || 'item'}-${items.length}`
      })
      count++
    }
  }

  const visibleCount = Math.min(slidesToShow, items.length)
  const maxIndex = Math.max(0, items.length - visibleCount)

  const handleNext = useCallback(() => {
    if (maxIndex <= 0) return
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const handlePrev = useCallback(() => {
    if (maxIndex <= 0) return
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  useEffect(() => {
    if (maxIndex <= 0 || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      return
    }

    autoPlayRef.current = setInterval(() => {
      handleNext()
    }, 3000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [maxIndex, isHovered, handleNext])

  if (rawItems.length === 0) {
    return null
  }

  const gapPx = 20
  const translateXPercent = currentIndex * (100 / visibleCount)

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
            <h2 className="section-title" style={{ textAlign: 'left', margin: '0.25rem 0 0.5rem 0' }}>
              Galeri Foto Produksi
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'left', margin: 0, maxWidth: '640px' }}>
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
          </div>
        </div>

        <div>
          <div className="gallery-carousel-viewport">
            <div
              className="gallery-carousel-track"
              style={{
                transform: `translateX(-${translateXPercent}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              {items.map((item) => (
                <div
                  key={item.uniqueKey}
                  className="gallery-carousel-slide"
                  style={{
                    flex: `0 0 calc(${100 / visibleCount}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`,
                    maxWidth: `calc(${100 / visibleCount}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`
                  }}
                >
                  <div className="gallery-card">
                    <div className="gallery-card-img-wrap" style={{ height: '220px' }}>
                      <img
                        src={item.image}
                        alt={item.title || (item.date ? `Foto dokumentasi ${item.date}` : 'Foto galeri')}
                        className="gallery-card-img"
                        loading="lazy"
                      />
                      {item.date && (
                        <span className="gallery-card-date-badge">
                          <Calendar size={13} />
                          <span>{item.date}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <div className="gallery-carousel-indicators">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`gallery-indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Lihat slide galeri ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}




