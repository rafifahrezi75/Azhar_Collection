export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="product-img-wrapper skeleton-shimmer" style={{ background: '#E2E8F0', position: 'relative' }}>
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            width: '80px',
            maxWidth: '40%',
            height: '20px',
            borderRadius: '4px',
            background: '#CBD5E1'
          }}
        />
      </div>

      <div className="product-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="skeleton-shimmer" style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#E2E8F0', flexShrink: 0 }} />
          <div className="skeleton-shimmer" style={{ width: '55%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
        </div>

        <div className="skeleton-shimmer" style={{ width: '90%', height: '15px', borderRadius: '4px', background: '#E2E8F0' }} />
        <div className="skeleton-shimmer" style={{ width: '65%', height: '15px', borderRadius: '4px', background: '#E2E8F0' }} />

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.625rem',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="skeleton-shimmer" style={{ width: '38%', height: '11px', borderRadius: '4px', background: '#E2E8F0' }} />
          <div className="skeleton-shimmer" style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
        </div>
      </div>
    </div>
  )
}

export function ProductCatalogSkeleton({ count = 8 }) {
  const items = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="products-grid">
      {items.map((key) => (
        <ProductCardSkeleton key={key} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page">
      <div
        className="subpage-header-banner skeleton-shimmer"
        style={{
          minHeight: '160px',
          padding: '6rem 0 2.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '110px', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.35)' }} />
          <div className="skeleton-shimmer" style={{ width: '70%', maxWidth: '340px', height: '28px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.45)' }} />
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="product-detail-hero-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', minWidth: 0 }}>
            <div
              className="product-detail-image-box skeleton-shimmer"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: '#E2E8F0'
              }}
            />

            <div className="product-detail-thumbs-grid">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer"
                  style={{
                    height: '65px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: '#E2E8F0'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', minWidth: 0 }}>
            <div className="skeleton-shimmer" style={{ width: '100px', height: '20px', borderRadius: '4px', background: '#E2E8F0' }} />

            <div>
              <div className="skeleton-shimmer" style={{ width: '85%', height: '28px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '0.5rem' }} />
              <div className="skeleton-shimmer" style={{ width: '55%', height: '24px', borderRadius: '4px', background: '#CBD5E1' }} />
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-light)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div className="skeleton-shimmer" style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#CBD5E1', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: 0 }}>
                <div className="skeleton-shimmer" style={{ width: '60%', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
                <div className="skeleton-shimmer" style={{ width: '40%', height: '11px', borderRadius: '4px', background: '#E2E8F0' }} />
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-light)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div className="skeleton-shimmer" style={{ width: '130px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
              {[1, 2, 3].map((idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="skeleton-shimmer" style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#CBD5E1', flexShrink: 0 }} />
                  <div className="skeleton-shimmer" style={{ width: `${80 - idx * 10}%`, height: '13px', borderRadius: '4px', background: '#E2E8F0' }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton-shimmer" style={{ width: '160px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
              <div className="skeleton-shimmer" style={{ width: '100%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
              <div className="skeleton-shimmer" style={{ width: '94%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
              <div className="skeleton-shimmer" style={{ width: '70%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <div className="skeleton-shimmer" style={{ width: '160px', minWidth: '120px', flex: '1 1 140px', height: '42px', borderRadius: 'var(--radius-md)', background: '#CBD5E1' }} />
              <div className="skeleton-shimmer" style={{ width: '130px', minWidth: '110px', flex: '1 1 120px', height: '42px', borderRadius: 'var(--radius-md)', background: '#E2E8F0' }} />
            </div>
          </div>
        </div>

        <div>
          <div className="skeleton-shimmer" style={{ width: '220px', maxWidth: '70%', height: '22px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1.5rem' }} />
          <ProductCatalogSkeleton count={4} />
        </div>
      </div>
    </div>
  )
}

export function ClientCardSkeleton() {
  return (
    <div className="client-clean-card skeleton-card">
      <div className="client-clean-img-wrap skeleton-shimmer" style={{ background: '#E2E8F0' }} />

      <div className="client-clean-content">
        <div
          className="skeleton-shimmer"
          style={{
            width: '85%',
            height: '18px',
            borderRadius: '4px',
            background: '#CBD5E1',
            marginBottom: '0.625rem'
          }}
        />

        <div className="client-clean-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div className="client-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div className="skeleton-shimmer" style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#CBD5E1', flexShrink: 0 }} />
            <div className="skeleton-shimmer" style={{ width: '50%', height: '12px', borderRadius: '3px', background: '#E2E8F0' }} />
          </div>
          <div className="client-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div className="skeleton-shimmer" style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#CBD5E1', flexShrink: 0 }} />
            <div className="skeleton-shimmer" style={{ width: '65%', height: '12px', borderRadius: '3px', background: '#E2E8F0' }} />
          </div>
        </div>
      </div>

      <div
        className="client-order-badge skeleton-shimmer"
        style={{
          width: '120px',
          maxWidth: '100%',
          height: '26px',
          background: '#E2E8F0',
          borderColor: 'transparent',
          margin: 0
        }}
      />
    </div>
  )
}

export function ClientsGridSkeleton({ count = 8 }) {
  const items = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="clients-clean-grid">
      {items.map((key) => (
        <ClientCardSkeleton key={key} />
      ))}
    </div>
  )
}

export function GalleryGridSkeleton({ count = 8 }) {
  const items = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="gallery-page-grid">
      {items.map((key) => (
        <div key={key} className="gallery-card skeleton-card">
          <div className="gallery-card-img-wrap skeleton-shimmer" style={{ height: '220px', background: '#E2E8F0' }} />
        </div>
      ))}
    </div>
  )
}

export function ClientDetailSkeleton() {
  return (
    <div className="client-detail-page">
      <div
        className="subpage-header-banner skeleton-shimmer"
        style={{
          minHeight: '160px',
          padding: '6rem 0 2.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '100px', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.35)' }} />
          <div className="skeleton-shimmer" style={{ width: '65%', maxWidth: '300px', height: '28px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.45)' }} />
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="client-detail-card">
          <div className="client-detail-top-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="skeleton-shimmer" style={{ width: '18px', height: '18px', borderRadius: '4px', background: '#CBD5E1' }} />
                <div className="skeleton-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '70%', height: '28px', borderRadius: '4px', background: '#CBD5E1' }} />
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className="skeleton-shimmer" style={{ width: '110px', height: '26px', borderRadius: 'var(--radius-full)', background: '#E2E8F0' }} />
                <div className="skeleton-shimmer" style={{ width: '130px', height: '26px', borderRadius: 'var(--radius-full)', background: '#E2E8F0' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '14px', borderRadius: '4px', background: '#E2E8F0', marginTop: '0.5rem' }} />
              <div className="skeleton-shimmer" style={{ width: '92%', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
              <div className="skeleton-shimmer" style={{ width: '75%', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', minWidth: 0 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--color-bg-light)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                    <div className="skeleton-shimmer" style={{ width: '50%', height: '11px', borderRadius: '3px', background: '#CBD5E1' }} />
                    <div className="skeleton-shimmer" style={{ width: '40%', height: '20px', borderRadius: '3px', background: '#CBD5E1' }} />
                  </div>
                  <div className="skeleton-shimmer" style={{ width: '42px', height: '42px', borderRadius: '4px', background: '#E2E8F0', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: '2rem' }}>
            <div className="skeleton-shimmer" style={{ width: '220px', height: '20px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1rem' }} />
            <div className="table-responsive-wrapper" style={{ height: '240px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)' }}>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>

        <div>
          <div className="skeleton-shimmer" style={{ width: '240px', maxWidth: '70%', height: '22px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1.5rem' }} />
          <ProductCatalogSkeleton count={4} />
        </div>
      </div>
    </div>
  )
}

export function ServiceDetailSkeleton() {
  return (
    <div className="service-detail-page">
      <div
        className="subpage-header-banner skeleton-shimmer"
        style={{
          minHeight: '160px',
          padding: '6rem 0 2.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '110px', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.35)' }} />
          <div className="skeleton-shimmer" style={{ width: '65%', maxWidth: '280px', height: '28px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.45)' }} />
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="service-detail-layout-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', minWidth: 0 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="service-detail-image skeleton-shimmer" style={{ background: '#E2E8F0' }} />
              <div className="service-detail-content-card">
                <div className="skeleton-shimmer" style={{ width: '90px', height: '14px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '0.75rem' }} />
                <div className="skeleton-shimmer" style={{ width: '70%', height: '26px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1rem' }} />
                <div className="skeleton-shimmer" style={{ width: '100%', height: '14px', borderRadius: '4px', background: '#E2E8F0', marginBottom: '0.5rem' }} />
                <div className="skeleton-shimmer" style={{ width: '95%', height: '14px', borderRadius: '4px', background: '#E2E8F0', marginBottom: '0.5rem' }} />
                <div className="skeleton-shimmer" style={{ width: '75%', height: '14px', borderRadius: '4px', background: '#E2E8F0', marginBottom: '2rem' }} />

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
                  <div className="skeleton-shimmer" style={{ width: '180px', height: '18px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1rem' }} />
                  <div className="table-responsive-wrapper" style={{ minHeight: '160px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-light)', border: '1px solid var(--color-border)' }}>
                    <div className="skeleton-shimmer" style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', minWidth: 0 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="skeleton-shimmer" style={{ width: '120px', height: '18px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1.25rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-shimmer" style={{ width: '100%', height: '42px', borderRadius: 'var(--radius-md)', background: '#E2E8F0' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
