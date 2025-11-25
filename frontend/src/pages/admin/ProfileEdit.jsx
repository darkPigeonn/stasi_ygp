import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { profileAPI } from '../../services/api';
import './AdminForms.css';
import './TiptapEditor.css';

const ProfileEdit = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    stasiName: '',
    parokiName: '',
    address: '',
    phone1: '',
    phone2: '',
    phone3: '',
    email: '',
    officeHours: '',
    aboutSaint: '',
    vision: '',
    mission: '',

    // Jadwal Misa - JSON array
    massSchedule: [
      { type: 'Misa Harian', day: '', time: '' },
      { type: 'Misa Mingguan', day: '', time: '' },
      { type: 'Misa Jumat Pertama', day: '', time: '' }
    ],

    // Social Media - JSON object
    socialMedia: {
      instagram: '',
      youtube: '',
      facebook: '',
      whatsapp: ''
    },

    logo: null
  });

  const addressEditor = useEditor({
    extensions: [StarterKit],
    content: formData.address,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, address: editor.getHTML() }));
    },
  });

  const aboutSaintEditor = useEditor({
    extensions: [StarterKit],
    content: formData.aboutSaint,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, aboutSaint: editor.getHTML() }));
    },
  });

  const visionEditor = useEditor({
    extensions: [StarterKit],
    content: formData.vision,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, vision: editor.getHTML() }));
    },
  });

  const missionEditor = useEditor({
    extensions: [StarterKit],
    content: formData.mission,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, mission: editor.getHTML() }));
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (addressEditor && formData.address !== addressEditor.getHTML()) {
      addressEditor.commands.setContent(formData.address);
    }
  }, [formData.address, addressEditor]);

  useEffect(() => {
    if (aboutSaintEditor && formData.aboutSaint !== aboutSaintEditor.getHTML()) {
      aboutSaintEditor.commands.setContent(formData.aboutSaint);
    }
  }, [formData.aboutSaint, aboutSaintEditor]);

  useEffect(() => {
    if (visionEditor && formData.vision !== visionEditor.getHTML()) {
      visionEditor.commands.setContent(formData.vision);
    }
  }, [formData.vision, visionEditor]);

  useEffect(() => {
    if (missionEditor && formData.mission !== missionEditor.getHTML()) {
      missionEditor.commands.setContent(formData.mission);
    }
  }, [formData.mission, missionEditor]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.get();

      if (response.data) {
        // Parse JSON fields if they are strings
        let massSchedule = [
          { type: 'Misa Harian', day: '', time: '' },
          { type: 'Misa Mingguan', day: '', time: '' },
          { type: 'Misa Jumat Pertama', day: '', time: '' }
        ];

        if (response.data.massSchedule) {
          try {
            let parsed = response.data.massSchedule;
            // Handle double/triple encoding
            while (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            if (Array.isArray(parsed)) {
              massSchedule = parsed;
            }
          } catch (e) {
            console.error('Error parsing massSchedule:', e);
          }
        }

        let socialMedia = {
          instagram: '',
          youtube: '',
          facebook: '',
          whatsapp: ''
        };

        if (response.data.socialMedia) {
          try {
            let parsed = response.data.socialMedia;
            // Handle double/triple encoding
            while (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
            socialMedia = { ...socialMedia, ...parsed };
          } catch (e) {
            console.error('Error parsing socialMedia:', e);
          }
        }

        setFormData({
          stasiName: response.data.stasiName || '',
          parokiName: response.data.parokiName || '',
          address: response.data.address || '',
          phone1: response.data.phone1 || '',
          phone2: response.data.phone2 || '',
          phone3: response.data.phone3 || '',
          email: response.data.email || '',
          officeHours: response.data.officeHours || '',
          aboutSaint: response.data.aboutSaint || '',
          vision: response.data.vision || '',
          mission: response.data.mission || '',
          massSchedule,
          socialMedia,
          logo: null
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMassScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.massSchedule];
    newSchedule[index] = {
      ...newSchedule[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      massSchedule: newSchedule
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const submitData = new FormData();

      // Text fields
      submitData.append('stasiName', formData.stasiName);
      submitData.append('parokiName', formData.parokiName);
      submitData.append('address', formData.address);
      submitData.append('phone1', formData.phone1);
      submitData.append('phone2', formData.phone2);
      submitData.append('phone3', formData.phone3);
      submitData.append('email', formData.email);
      submitData.append('officeHours', formData.officeHours);

      // HTML content fields
      submitData.append('aboutSaint', formData.aboutSaint);
      submitData.append('vision', formData.vision);
      submitData.append('mission', formData.mission);

      // JSON fields - double stringify for database storage
      submitData.append('massSchedule', JSON.stringify(JSON.stringify(formData.massSchedule)));
      submitData.append('socialMedia', JSON.stringify(JSON.stringify(formData.socialMedia)));

      // Logo file
      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      // Call API to update profile (ID is 1 from database)
      await profileAPI.update(1, submitData);

      setMessage({ type: 'success', text: 'Profile berhasil diupdate!' });

      // Reload profile after save
      setTimeout(() => {
        fetchProfile();
      }, 1000);

    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan profile: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Profile Stasi/Paroki</h1>
            <p>Kelola informasi profile stasi dan paroki</p>
          </div>
          <button
            type="submit"
            form="profile-form"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Menyimpan...' : 'Simpan Profile'}
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form id="profile-form" onSubmit={handleSubmit} className="admin-form">

          {/* Informasi Dasar */}
          <div className="form-section">
            <h2>Informasi Dasar</h2>

            <div className="form-group">
              <label htmlFor="stasiName">Nama Stasi *</label>
              <input
                type="text"
                id="stasiName"
                name="stasiName"
                value={formData.stasiName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="parokiName">Nama Paroki *</label>
              <input
                type="text"
                id="parokiName"
                name="parokiName"
                value={formData.parokiName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo">Logo Stasi/Paroki</label>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small>Format: JPG, PNG, GIF. Maksimal 2MB</small>
            </div>

            <div className="form-group">
              <label htmlFor="address">Alamat</label>
              <div className="tiptap-editor-wrapper">
                <div className="tiptap-menubar">
                  <button
                    type="button"
                    onClick={() => addressEditor?.chain().focus().toggleBold().run()}
                    className={addressEditor?.isActive('bold') ? 'is-active' : ''}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => addressEditor?.chain().focus().toggleItalic().run()}
                    className={addressEditor?.isActive('italic') ? 'is-active' : ''}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => addressEditor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={addressEditor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => addressEditor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={addressEditor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => addressEditor?.chain().focus().toggleBulletList().run()}
                    className={addressEditor?.isActive('bulletList') ? 'is-active' : ''}
                  >
                    Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => addressEditor?.chain().focus().toggleOrderedList().run()}
                    className={addressEditor?.isActive('orderedList') ? 'is-active' : ''}
                  >
                    Numbered List
                  </button>
                </div>
                <EditorContent editor={addressEditor} className="tiptap-editor-content" />
              </div>
            </div>
          </div>

          {/* Tentang Santo, Visi, dan Misi */}
          <div className="form-section">
            <h2>Informasi Sejarah & Identitas</h2>

            <div className="form-group">
              <label htmlFor="aboutSaint">Tentang Santo Pelindung</label>
              <div className="tiptap-editor-wrapper">
                <div className="tiptap-menubar">
                  <button type="button" onClick={() => aboutSaintEditor?.chain().focus().toggleBold().run()} className={aboutSaintEditor?.isActive('bold') ? 'is-active' : ''}>Bold</button>
                  <button type="button" onClick={() => aboutSaintEditor?.chain().focus().toggleItalic().run()} className={aboutSaintEditor?.isActive('italic') ? 'is-active' : ''}>Italic</button>
                  <button type="button" onClick={() => aboutSaintEditor?.chain().focus().toggleHeading({ level: 2 }).run()} className={aboutSaintEditor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
                  <button type="button" onClick={() => aboutSaintEditor?.chain().focus().toggleHeading({ level: 3 }).run()} className={aboutSaintEditor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
                  <button type="button" onClick={() => aboutSaintEditor?.chain().focus().toggleBulletList().run()} className={aboutSaintEditor?.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
                  <button type="button" onClick={() => aboutSaintEditor?.chain().focus().toggleOrderedList().run()} className={aboutSaintEditor?.isActive('orderedList') ? 'is-active' : ''}>Numbered List</button>
                </div>
                <EditorContent editor={aboutSaintEditor} className="tiptap-editor-content" />
              </div>
              <small>Informasi tentang Santo Yohanes Gabriel Perboyre atau santo pelindung stasi</small>
            </div>

            <div className="form-group">
              <label htmlFor="vision">Visi Stasi</label>
              <div className="tiptap-editor-wrapper">
                <div className="tiptap-menubar">
                  <button type="button" onClick={() => visionEditor?.chain().focus().toggleBold().run()} className={visionEditor?.isActive('bold') ? 'is-active' : ''}>Bold</button>
                  <button type="button" onClick={() => visionEditor?.chain().focus().toggleItalic().run()} className={visionEditor?.isActive('italic') ? 'is-active' : ''}>Italic</button>
                  <button type="button" onClick={() => visionEditor?.chain().focus().toggleHeading({ level: 2 }).run()} className={visionEditor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
                  <button type="button" onClick={() => visionEditor?.chain().focus().toggleHeading({ level: 3 }).run()} className={visionEditor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
                  <button type="button" onClick={() => visionEditor?.chain().focus().toggleBulletList().run()} className={visionEditor?.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
                  <button type="button" onClick={() => visionEditor?.chain().focus().toggleOrderedList().run()} className={visionEditor?.isActive('orderedList') ? 'is-active' : ''}>Numbered List</button>
                </div>
                <EditorContent editor={visionEditor} className="tiptap-editor-content" />
              </div>
              <small>Visi atau cita-cita stasi</small>
            </div>

            <div className="form-group">
              <label htmlFor="mission">Misi Stasi</label>
              <div className="tiptap-editor-wrapper">
                <div className="tiptap-menubar">
                  <button type="button" onClick={() => missionEditor?.chain().focus().toggleBold().run()} className={missionEditor?.isActive('bold') ? 'is-active' : ''}>Bold</button>
                  <button type="button" onClick={() => missionEditor?.chain().focus().toggleItalic().run()} className={missionEditor?.isActive('italic') ? 'is-active' : ''}>Italic</button>
                  <button type="button" onClick={() => missionEditor?.chain().focus().toggleHeading({ level: 2 }).run()} className={missionEditor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
                  <button type="button" onClick={() => missionEditor?.chain().focus().toggleHeading({ level: 3 }).run()} className={missionEditor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
                  <button type="button" onClick={() => missionEditor?.chain().focus().toggleBulletList().run()} className={missionEditor?.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
                  <button type="button" onClick={() => missionEditor?.chain().focus().toggleOrderedList().run()} className={missionEditor?.isActive('orderedList') ? 'is-active' : ''}>Numbered List</button>
                </div>
                <EditorContent editor={missionEditor} className="tiptap-editor-content" />
              </div>
              <small>Misi atau langkah-langkah untuk mencapai visi stasi</small>
            </div>
          </div>

          {/* Kontak */}
          <div className="form-section">
            <h2>Informasi Kontak</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone1">No Telepon 1</label>
                <input
                  type="text"
                  id="phone1"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleChange}
                  placeholder="Contoh: (021) 1234567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone2">No Telepon 2</label>
                <input
                  type="text"
                  id="phone2"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone3">No Telepon 3</label>
                <input
                  type="text"
                  id="phone3"
                  name="phone3"
                  value={formData.phone3}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@church.org"
              />
            </div>

            <div className="form-group">
              <label htmlFor="officeHours">Jam Buka Sekretariat</label>
              <textarea
                id="officeHours"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleChange}
                rows="3"
                placeholder="Senin - Jumat: 09:00 - 17:00&#10;Sabtu: 09:00 - 13:00"
              />
            </div>
          </div>

          {/* Jadwal Misa */}
          <div className="form-section">
            <h2>Jadwal Misa</h2>

            {formData.massSchedule.map((schedule, index) => (
              <div key={index} className="schedule-group">
                <h3>{schedule.type}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hari</label>
                    <input
                      type="text"
                      value={schedule.day}
                      onChange={(e) => handleMassScheduleChange(index, 'day', e.target.value)}
                      placeholder="Contoh: Senin - Sabtu"
                    />
                  </div>
                  <div className="form-group">
                    <label>Jam</label>
                    <input
                      type="text"
                      value={schedule.time}
                      onChange={(e) => handleMassScheduleChange(index, 'time', e.target.value)}
                      placeholder="Contoh: 17:00 | 15:00 | 08:00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div className="form-section">
            <h2>Social Media</h2>

            <div className="form-group">
              <label htmlFor="instagram">Instagram</label>
              <input
                type="text"
                id="instagram"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                placeholder="URL link Instagram"
              />
            </div>

            <div className="form-group">
              <label htmlFor="youtube">YouTube</label>
              <input
                type="text"
                id="youtube"
                value={formData.socialMedia.youtube}
                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                placeholder="URL link YouTube"
              />
            </div>

            <div className="form-group">
              <label htmlFor="facebook">Facebook</label>
              <input
                type="text"
                id="facebook"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                placeholder="URL link Facebook"
              />
            </div>

            <div className="form-group">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                type="text"
                id="whatsapp"
                value={formData.socialMedia.whatsapp}
                onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                placeholder="URL link WhatsApp"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
