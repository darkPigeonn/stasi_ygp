import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Footer.css';

const Footer = ({ profile, loading }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{profile?.stasiName || 'Stasi Yohanes Gabriel Perboyre'}</h3>
            <p>{profile?.parokiName || 'Paroki Santo Yakobus Kelapa Gading'}</p>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={18} />
                {profile?.address ? (
                  <span dangerouslySetInnerHTML={{ __html: profile.address }} />
                ) : (
                  <span>Jl. Boulevard Raya, Kelapa Gading, Jakarta Utara</span>
                )}
              </div>
              {profile?.phone1 && (
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{profile.phone1}</span>
                </div>
              )}
              {profile?.phone2 && (
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{profile.phone2}</span>
                </div>
              )}
              {profile?.phone3 && (
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{profile.phone3}</span>
                </div>
              )}
              {profile?.email && (
                <div className="contact-item">
                  <Mail size={18} />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="footer-section">
            <h3>Jadwal Misa</h3>
            <div className="schedule">
              {profile?.massSchedule && Array.isArray(profile.massSchedule) ? (
                profile.massSchedule.map((schedule, index) => (
                  <div key={index} className="schedule-item">
                    <Clock size={18} />
                    <div>
                      <strong>{schedule.day}</strong>
                      <p>{schedule.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="schedule-item">
                    <Clock size={18} />
                    <div>
                      <strong>Minggu</strong>
                      <p>07:00 & 17:00 WIB</p>
                    </div>
                  </div>
                  <div className="schedule-item">
                    <Clock size={18} />
                    <div>
                      <strong>Jumat Pertama</strong>
                      <p>18:30 WIB</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="footer-section">
            <h3>Link Cepat</h3>
            <ul className="footer-links">
              <li><a href="/artikel">Artikel</a></li>
              <li><a href="/pengumuman">Pengumuman</a></li>
              <li><a href="/sejarah">Sejarah</a></li>
              <li><a href="/pastor">Pastor</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Media Sosial</h3>
            <div className="social-links">
              {profile?.socialMedia?.youtube ? (
                <a href={profile.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              ) : (
                <a href="https://www.youtube.com/@ParokiKG" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              )}
              {profile?.socialMedia?.instagram ? (
                <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              ) : (
                <a href="https://www.instagram.com/stasijgp" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {profile?.socialMedia?.facebook ? (
                <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              ) : (
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {profile?.socialMedia?.whatsapp && (
                <a href={`https://wa.me/${profile.socialMedia.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 {profile?.stasiName || 'Stasi Yohanes Gabriel Perboyre'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
