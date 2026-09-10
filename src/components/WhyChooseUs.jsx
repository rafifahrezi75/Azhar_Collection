import { Scissors, ShieldCheck, Clock, BadgePercent } from 'lucide-react'
import { whyUsData } from '../data/siteData'

export default function WhyChooseUs() {
  const icons = [
    <Scissors size={28} />,
    <ShieldCheck size={28} />,
    <Clock size={28} />,
    <BadgePercent size={28} />
  ]

  return (
    <section id="why-us" className="why-us-section">
      <div className="container">
        <div className="why-us-header">
          <span className="section-tag">{whyUsData.tag}</span>
          <h2 className="section-title">{whyUsData.title}</h2>
          <p className="section-subtitle">{whyUsData.subtitle}</p>
        </div>

        <div className="why-us-grid">
          {whyUsData.items.map((item, index) => (
            <div key={index} className="why-card">
              <div className="why-card-icon">
                {icons[index]}
              </div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
