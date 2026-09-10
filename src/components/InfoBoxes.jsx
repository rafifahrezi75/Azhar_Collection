import { Link } from 'react-router-dom'
import { Scissors, ShieldCheck, ArrowRight } from 'lucide-react'
import { infoBoxesData } from '../data/siteData'

export default function InfoBoxes() {
  return (
    <section className="info-boxes-section">
      <div className="container">
        <div className="info-boxes-grid">
          <div className="info-box-white">
            <div className="info-box-icon">
              <Scissors size={26} />
            </div>
            <div>
              <h3 className="info-box-title">{infoBoxesData.box1.title}</h3>
              <p className="info-box-desc">{infoBoxesData.box1.desc}</p>
              <Link to="/portofolio" className="info-box-link">
                <span>{infoBoxesData.box1.link}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="info-box-dark">
            <div className="info-box-icon">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className="info-box-title">{infoBoxesData.box2.title}</h3>
              <p className="info-box-desc">{infoBoxesData.box2.desc}</p>
              <Link to="/layanan" className="info-box-link">
                <span>{infoBoxesData.box2.link}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
