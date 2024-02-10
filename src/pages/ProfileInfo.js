import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from '../rtk/slices/Translate-slice';
import NavHeader from '../components/NavHeader';
import { selectToken } from '../rtk/slices/Auth-slice';
import { useEffect } from 'react';
import './profileInfo.css';


function ProfileInfo() {
  const dispatch = useDispatch();
  const bearerToken = useSelector(selectToken);
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    city: '',
    region: '',
    street: '',
    zipCode: '',
  });

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

  const handleProductClick = (productId) => {
    // Assuming you have a function for handling product clicks
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        'https://ecommerce-1-q7jb.onrender.com/api/v1/user/en/update',
        userData,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        }
      );
      console.log('User data updated successfully', response.data);

      // Update user address if editing
      if (isEditing) {
        const addressResponse = await axios.post(
          'https://ecommerce-1-q7jb.onrender.com/api/v1/user/address/new',
          {
            country: userData.country,
            city: userData.city,
            region: userData.region,
            street: userData.street,
            zipCode: userData.zipCode,
          },
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
            },
          }
        );
        console.log('User address updated successfully', addressResponse.data);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          'https://ecommerce-1-q7jb.onrender.com/api/v1/user/en',
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
            },
          }
        );
        setUserData(response.data.data.user);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [bearerToken]);

  return (
    <div>
      <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleProductClick={handleProductClick}
      />

      <div className="green-containerr cartGreen">
        <div className="header-container">
          <div className="userinfoContainer">
            <div className="imgInfo">
              <FaUser style={{ fontSize: '60px', color: 'black' }} />
              <h5>{userData.email}</h5>
              <button style={{color: 'white'}} onClick={handleEditClick}>{translations[language]?.edit}</button>
            </div>

            <div className="userdetailsInfo">
              <div className="flexinput">
                <input
                  className="name"
                  type="text"
                  name="country"
                  placeholder={translations[language]?.country}
                  value={userData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  className="name"
                  type="text"
                  name="city"
                  placeholder={translations[language]?.city}
                  value={userData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="flexinput">
              <input
                  className="name"
                  type="text"
                  name="region"
                  placeholder={translations[language]?.region}
                  value={userData.region}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <input
                  className="name"
                  type="text"
                  name="street"
                  placeholder={translations[language]?.street}
                  value={userData.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="flexinput">
              <input
                  className="name"
                  type="text"
                  name="zipCode"
                  placeholder={translations[language]?.zipcode}
                  value={userData.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
               
              </div>

              {isEditing && (
                <div className="flexinput flexbutton">
                  <button onClick={handleSaveClick}>{translations[language]?.save}</button>
                  <button onClick={handleCancelClick}>{translations[language]?.cancel}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileInfo;
