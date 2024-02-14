import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import clock from '../images/clock-svgrepo-com.png' ;
import email2 from '../images/email-1-svgrepo-com.png';
import path from '../images/path929.png';
import phone2 from '../images/phone-modern-svgrepo-com.png';
import email from '../images/Email icon.png';
import address from '../images/Location icon.png';
import phone from '../images/phone icon.png';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '../components/Whatsapp';

import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from '../rtk/slices/Translate-slice';
import NavHeader from '../components/NavHeader';
import Footer from '../components/Footer';
import './contact.css';

function Contact() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false); 
  const allProducts = useSelector((state) => state.products);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

  

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    // Add logic to handle saving data
    setIsEditing(false);
  };

  return (
    <div className='help'>
      <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
       
        handleProductClick={handleProductClick}
      />

      <div className="green-containerr greenabout cartGreen ">
        <div className='contactContainer home-containerr'>
           <WhatsAppIcon />
            <div className='flexcontact'>
                <div className='onecontact'>
                    <div className='flexonecontact'>
                        
                        <div className='imgcontact'>
                            <img src={path}/>
                        </div>
                        <div className='detailscontact'>
                            <h4>{translations[language]?.addresscontact}</h4>
                            <h2>LAAYOUNE : MADINAT EL WAHDA BLOC B NR 91 LAAYOUNE (M).</h2>
                            <h2>Tetouan: Mezanine bloc B Bureau n 4 BOROUJ 16 Avenue des Far N° 873 Tétouan</h2>
                        </div>
                     
                    </div>

                    <div className='flexonecontact'>
                        
                        <div className='imgcontact'>
                            <img src={clock}/>
                        </div>
                        <div className='detailscontact'>
                            <h4>{translations[language]?.hours}</h4>
                            <h2>{translations[language]?.day}</h2>
                            <h2>{translations[language]?.weekend}</h2>
                        </div>
                     
                    </div>

                    <div className='flexonecontact'>
                        
                        <div className='imgcontact'>
                            <img src={phone2}/>
                        </div>
                        <div className='detailscontact'>
                            <h4>{translations[language]?.phonenumber}</h4>
                            <h2>00212689831227</h2>
                        </div>
                     
                    </div>

                    <div className='flexonecontact'>
                        
                        <div className='imgcontact'>
                            <img src={email2}/>
                        </div>
                        <div className='detailscontact'>
                            <h4>{translations[language]?.email}</h4>
                            <h2>contact@vitaparapharma.com</h2>
                        </div>
                     
                    </div>


                </div>
                <div className='onecontactForm'>
                    <div className='formcontact'>
                        <h4>{translations[language]?.contactform}</h4>
                        <input
                           type="text"
                           placeholder={translations[language]?.firstname}
                           name="name"        
                        />
                        <input
                           type="text"
                           placeholder={translations[language]?.email}
                           name="email"        
                        />
                        <input placeholder={translations[language]?.message}/>
                    
                    </div>
                    <div className='contactbtn'>
                        <button>{translations[language]?.submitcontact}</button>
                        </div>
                </div>
            </div>
            
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Contact;
