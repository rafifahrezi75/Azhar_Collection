import { useState, useEffect, useRef } from 'react'
import { getGalleryList } from '../firebase/adminService'
import { Calendar } from 'lucide-react'

export default function GallerySection() {
  const [rawItems, setRawItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(4)
  const [enableTransition, setEnableTransition] = useState(true)
  const autoPlayRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    getGalleryList().then((data) => {
      if (isMounted && data && data.length > 0) {
        setRawItems(data.slice(0, 7))
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

  let baseItems = []
  if (rawItems.length > 0) {
    let count = 0
    while (baseItems.length < 7) {
      const it = rawItems[count % rawItems.length]
      baseItems.push({
        ...it,
        originalIndex: baseItems.length,
        uniqueKey: `${it.id || 'item'}-${baseItems.length}`
      })
      count++
    }
  }

  const displayItems = baseItems.length > 0
    ? [...baseItems, ...baseItems.map((it, idx) => ({ ...it, uniqueKey: `${it.uniqueKey}-clone-${idx}` }))]
    : []

  const totalBase = baseItems.length
  const visibleCount = Math.min(slidesToShow, totalBase)

  const handleNext = () => {
    setEnableTransition(true)
    setCurrentIndex((prev) => prev + 1)
  }

  const handleTransitionEnd = () => {
    if (currentIndex >= totalBase) {
      setEnableTransition(false)
      setCurrentIndex(0)
    }
  }

  useEffect(() => {
    if (totalBase <= 0 || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      return
    }

    autoPlayRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [totalBase, isHovered])

  if (rawItems.length === 0) {
    return null
  }

  const gapPx = 20
  const translateXPercent = currentIndex * (100 / visibleCount)
  const activeDotIndex = currentIndex % totalBase

  return (
    <section
      className="gallery-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
          <span className="section-tag">DOKUMENTASI & GALERI</span>
          <h2 className="section-title">Galeri Foto Produksi</h2>
          <p className="section-subtitle">
            Dokumentasi pengerjaan di workshop Azhar Collection.
          </p>
        </div>

        <div className="gallery-carousel-viewport">
          <div
            className="gallery-carousel-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${translateXPercent}%)`,
              transition: enableTransition ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
            }}
          >
            {displayItems.map((item) => (
              <div
                key={item.uniqueKey}
                className="gallery-carousel-slide"
                style={{
                  flex: `0 0 calc(${100 / visibleCount}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`,
                  maxWidth: `calc(${100 / visibleCount}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`
                }}
              >
                <div className="gallery-card">
                  <div className="gallery-card-img-wrap" style={{ height: '230px' }}>
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

        {totalBase > 0 && (
          <div className="gallery-carousel-indicators" style={{ marginTop: '2rem' }}>
            {Array.from({ length: totalBase }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`gallery-indicator-dot ${idx === activeDotIndex ? 'active' : ''}`}
                onClick={() => {
                  setEnableTransition(true)
                  setCurrentIndex(idx)
                }}
                aria-label={`Lihat slide galeri ${idx + 1}`}
                title={`Pindah ke slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
