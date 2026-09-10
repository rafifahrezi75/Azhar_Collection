import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getTestimoniList } from '../firebase/adminService'
import { testimonialsData as fallbackTestimonials } from '../data/siteData'

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [active, setActive] = useState(0)
  const [perView, setPerView] = useState(2)

  useEffect(() => {
    let isMounted = true
    getTestimoniList().then((list) => {
      if (isMounted && list) setTestimonials(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setPerView(2)
      } else {
        setPerView(1)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxActive = Math.max(0, testimonials.length - perView)

  const handleNext = () => {
    if (testimonials.length === 0) return
    setActive((prev) => (prev >= maxActive ? 0 : prev + 1))
  }

  const handlePrev = () => {
    if (testimonials.length === 0) return
    setActive((prev) => (prev <= 0 ? maxActive : prev - 1))
  }

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="testimonials-mobile-header">
          <span className="section-tag">TESTIMONI PELANGGAN</span>
          <h2 className="section-title">Apa Kata Mitra & Pelanggan Kami</h2>
        </div>

        {testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)', marginTop: '2rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Belum ada data ulasan testimoni yang ditampilkan. Silakan tambahkan testimoni baru melalui Admin Panel.
            </p>
          </div>
        ) : (
          <div className="testimonials-layout">
            <div className="testimonials-desktop-intro">
              <span className="section-tag">TESTIMONI PELANGGAN</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginTop: '0.5rem', lineHeight: 1.25 }}>
                Apa Kata Mitra & Pelanggan Kami
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                Kepercayaan sekolah, dinas instansi, dan pedagang grosir adalah bukti dedikasi mutu dan ketepatan waktu Azhar Collection.
              </p>
            </div>

            <div className="testimonials-cards-wrapper">
              <button
                type="button"
                className="testimonial-arrow-btn arrow-prev"
                onClick={handlePrev}
                aria-label="Testimoni sebelumnya"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                className="testimonial-arrow-btn arrow-next"
                onClick={handleNext}
                aria-label="Testimoni berikutnya"
              >
                <ChevronRight size={22} />
              </button>

              <div className="testimonials-track-container">
                <div
                  className="testimonials-track"
                  style={{
                    transform: `translateX(-${active * (100 / perView)}%)`
                  }}
                >
                  {testimonials.map((item) => (
                    <div
                      key={item.id}
                      className="testimonial-slide-item"
                      style={{ width: `${100 / perView}%` }}
                    >
                      <div className="testimonial-card-box">
                        <p className="testimonial-quote-text">
                          "{item.comment || item.quote || item.content}"
                        </p>

                        <div className="testimonial-bottom-row">
                          <div className="testimonial-author-info">
                            <div className="testimonial-author-avatar">
                              {(item.clientName || item.name || 'P').charAt(0)}
                            </div>
                            <div>
                              <h4 className="testimonial-author-name">{item.clientName || item.name}</h4>
                              <p className="testimonial-author-inst">{item.institution || item.role}</p>
                            </div>
                          </div>

                          <span className="testimonial-quote-glyph">”</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
