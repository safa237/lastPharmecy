import './changepassword.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { selectToken } from '../rtk/slices/Auth-slice';

import axios from 'axios';  // Import Axios
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from '../rtk/slices/Translate-slice';
import NavHeader from '../components/NavHeader';
import email from "../images/Email icon.png";
import address from "../images/Location icon.png";
import phone from "../images/phone icon.png";
import { Link } from "react-router-dom";


function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

  const bearerToken = useSelector(selectToken);
  
  const handleSaveClick = async () => {
    try {
      const apiUrl = 'http://195.35.28.106:8080/api/v1/user/password/update';

      const headers = {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json', 
      };

      const response = await axios.put(apiUrl, {
        oldPassword: currentPassword,
        newPassword: newPassword,
      }, { headers });

      if (response.data && response.data.success) {
        console.log('Password updated successfully');
      } else {
        console.error('Failed to update password:', response.data);
      }
    } catch (error) {
      console.error('Error updating password:', error);
     
    }
  };


  

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  return (
    <div>
      <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleProductClick={handleProductClick}
      />

      <div className="green-containerr cartGreen ">
        <div className="header-container">
          <div className='changePasswordText'>
          
            <h2>{translations[language]?.change}</h2>
            <h6>{translations[language]?.choose}</h6>
            <h6>{translations[language]?.changing}</h6>
          </div>
          <div className='changePasswordInputs'>
            <input
              className="name"
              type="password"
              name="newPassword"
              placeholder={translations[language]?.newpass}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              className="name"
              type="password"
              name="currentPassword"
              placeholder={translations[language]?.oldpass}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <div className="flexinput flexbutton">
              <button onClick={handleSaveClick}>{translations[language]?.save}</button>
              <button>{translations[language]?.cancel}</button>
            </div>
          </div>
        </div>

      </div>

      <div className="footerr footerPhr">
            <div className=" header-container ">
              <div className="flexFooter">
                <div className="cartfooter">
                  <div className="important">
                    <h1>important links</h1>
                    <Link className="footerlink">privacy policy </Link>
                    <Link className="footerlink">cookies policy </Link>
                    <Link className="footerlink">Terms & conditions </Link>
                  </div>
                  <div className="information">
                    <h1>Information on delivery</h1>
                    <h2>
                      Informations d'expédition Pour garantir que vos achats
                      arrivent sans problème, assurez-vous de fournir l'adresse et
                      le numéro de téléphone corrects pour garantir une expérience
                      d'achat pratique et efficace. Assurez-vous que vos
                      informations d'expédition sont à jour, y compris les détails
                      de l'adresse et le délai de livraison souhaité, pour vous
                      assurer de recevoir votre commande rapidement et sans
                      retards inutiles.
                    </h2>
                  </div>
                </div>
                <div className="cartfooter cartfootertwo">
                  <div className="important">
                    <h1>coordonnées</h1>
                    <h2>
                      Contactez-nous pour toute demande de renseignements ou
                      d'assistance dont vous avez besoin, nous sommes là pour vous
                      fournir soutien et conseils
                    </h2>
                  </div>
                  <div className="address">
                    <div className="flexaddress">
                      <img src={address} />
                      <h2>l'adresse:</h2>
                    </div>
                    <h2>
                      LAAYOUNE : MADINAT EL WAHDA BLOC B NR 91 LAAYOUNE (M) <br />
                      Tetouan: Mezanine bloc B Bureau n 4 BOROUJ 16 Avenue des Far
                      N° 873 Tétouan
                    </h2>
                  </div>
                  <div className="flexphoneemail">
                    <div className="address">
                      <div className="flexaddress">
                        <img src={phone} />
                        <h2>Phone:</h2>
                      </div>
                      <h2>00212689831227</h2>
                    </div>
                    <div className="address">
                      <div className="flexaddress">
                        <img src={email} />
                        <h2>Email:</h2>
                      </div>
                      <h2>contact@vitaparapharma.com</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}

export default ChangePassword;
