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
        className="skeleton-shimmer"
        style={{
          width: '100%',
          height: '180px',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '120px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
          <div className="skeleton-shimmer" style={{ width: '320px', height: '28px', borderRadius: '4px', background: '#CBD5E1' }} />
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)',
            gap: '3rem',
            alignItems: 'start',
            background: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '4rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              className="skeleton-shimmer"
              style={{
                width: '100%',
                height: '420px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: '#E2E8F0'
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.25rem 0' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer"
                  style={{
                    width: '85px',
                    height: '65px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: '#E2E8F0',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="skeleton-shimmer" style={{ width: '100px', height: '22px', borderRadius: '4px', background: '#E2E8F0' }} />

            <div>
              <div className="skeleton-shimmer" style={{ width: '90%', height: '30px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '0.5rem' }} />
              <div className="skeleton-shimmer" style={{ width: '60%', height: '30px', borderRadius: '4px', background: '#CBD5E1' }} />
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
              <div className="skeleton-shimmer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#CBD5E1', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                <div className="skeleton-shimmer" style={{ width: '70%', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
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
                  <div className="skeleton-shimmer" style={{ width: '16px', height: '16px', borderRadius: '3px', background: '#CBD5E1' }} />
                  <div className="skeleton-shimmer" style={{ width: `${85 - idx * 10}%`, height: '13px', borderRadius: '4px', background: '#E2E8F0' }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton-shimmer" style={{ width: '180px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
              <div className="skeleton-shimmer" style={{ width: '100%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
              <div className="skeleton-shimmer" style={{ width: '96%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
              <div className="skeleton-shimmer" style={{ width: '75%', height: '12px', borderRadius: '4px', background: '#E2E8F0' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div className="skeleton-shimmer" style={{ width: '170px', height: '42px', borderRadius: 'var(--radius-md)', background: '#CBD5E1' }} />
              <div className="skeleton-shimmer" style={{ width: '130px', height: '42px', borderRadius: 'var(--radius-md)', background: '#E2E8F0' }} />
            </div>
          </div>
        </div>

        <div>
          <div className="skeleton-shimmer" style={{ width: '220px', height: '22px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1.5rem' }} />
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
        className="skeleton-shimmer"
        style={{
          width: '100%',
          height: '180px',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '100px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
          <div className="skeleton-shimmer" style={{ width: '280px', height: '28px', borderRadius: '4px', background: '#CBD5E1' }} />
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div
          style={{
            background: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div className="skeleton-shimmer" style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-lg)', background: '#E2E8F0', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div className="skeleton-shimmer" style={{ width: '60%', height: '24px', borderRadius: '4px', background: '#CBD5E1' }} />
              <div className="skeleton-shimmer" style={{ width: '40%', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="skeleton-shimmer" style={{ width: '140px', height: '70px', borderRadius: 'var(--radius-md)', background: '#E2E8F0' }} />
            <div className="skeleton-shimmer" style={{ width: '140px', height: '70px', borderRadius: 'var(--radius-md)', background: '#E2E8F0' }} />
            <div className="skeleton-shimmer" style={{ width: '140px', height: '70px', borderRadius: 'var(--radius-md)', background: '#E2E8F0' }} />
          </div>
        </div>

        <div>
          <div className="skeleton-shimmer" style={{ width: '240px', height: '22px', borderRadius: '4px', background: '#CBD5E1', marginBottom: '1.5rem' }} />
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
        className="skeleton-shimmer"
        style={{
          width: '100%',
          height: '180px',
          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '110px', height: '14px', borderRadius: '4px', background: '#CBD5E1' }} />
          <div className="skeleton-shimmer" style={{ width: '260px', height: '28px', borderRadius: '4px', background: '#CBD5E1' }} />
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div
          style={{
            background: '#FFFFFF',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div className="skeleton-shimmer" style={{ width: '70%', height: '26px', borderRadius: '4px', background: '#CBD5E1' }} />
          <div className="skeleton-shimmer" style={{ width: '100%', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
          <div className="skeleton-shimmer" style={{ width: '95%', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
          <div className="skeleton-shimmer" style={{ width: '80%', height: '14px', borderRadius: '4px', background: '#E2E8F0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer" style={{ height: '120px', borderRadius: 'var(--radius-lg)', background: '#E2E8F0' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

