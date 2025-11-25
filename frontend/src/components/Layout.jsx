import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { profileAPI } from '../services/api';
import Header from './Header';
import Footer from './Footer';


const Layout = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.get();

        // Parse massSchedule and socialMedia if they are strings
        let parsedProfile = { ...response.data };

        // Parse massSchedule
        if (response.data?.massSchedule) {
          try {
            let schedule = response.data.massSchedule;
            // Handle double/triple encoding
            while (typeof schedule === 'string') {
              schedule = JSON.parse(schedule);
            }
            parsedProfile.massSchedule = Array.isArray(schedule) ? schedule : [];
          } catch (e) {
            console.error('Error parsing massSchedule:', e);
            parsedProfile.massSchedule = [];
          }
        }

        // Parse socialMedia
        if (response.data?.socialMedia) {
          try {
            let socialMedia = response.data.socialMedia;
            // Handle double/triple encoding
            while (typeof socialMedia === 'string') {
              socialMedia = JSON.parse(socialMedia);
            }
            parsedProfile.socialMedia = socialMedia;
          } catch (e) {
            console.error('Error parsing socialMedia:', e);
            parsedProfile.socialMedia = {};
          }
        }

        console.log('Parsed Profile:', parsedProfile);
        console.log('Parsed massSchedule:', parsedProfile.massSchedule);
        console.log('Parsed socialMedia:', parsedProfile.socialMedia);

        setProfile(parsedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="layout">
      <Header profile={profile} loading={loading} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer profile={profile} loading={loading} />
    </div>
  );
};

export default Layout;
