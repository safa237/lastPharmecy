import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Vita Logo2.png' ;
import goal from '../images/goal.png';
import delivery from '../images/delivery.png';
import awards from '../images/awards.png';
import people from '../images/people.png';
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
import './about.css';

function About() {
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
      <div className=" testtt">
      <WhatsAppIcon />
        <div className='aboutcontent' >
          <div className='about-head'>
            <div className='imgabout'>
                <div >
                <img src={logo} alt="Logo" />
                </div>
            </div>
            <div className='infoabout'>
                <div>
                    <h5>{translations[language]?.aboutParagraph}
                    </h5>
                </div>
                <div className='buybtn'>
                   
                </div>
            </div>
          </div>

          <div className='flexabout'>
            <div className='cardabout'>
                <div className='imgcardabout'>
                   <img src={goal} alt="goal" />
                </div>
                <div className='detailscardabout'>
                    <h3> {translations[language]?.accuracy} </h3>
                    <p> {translations[language]?.accuracyParagraph}
                    </p>
                </div>
            </div>
            <div className='cardabout'>
                <div className='imgcardabout'>
                   <img src={awards} alt="awards" />
                </div>
                <div className='detailscardabout'>
                    <h3> {translations[language]?.awards} </h3>
                    <p> {translations[language]?.winners} </p>
                </div>
            </div>
            <div className='cardabout'>
                <div className='imgcardabout'>
                   <img src={people} alt="people" />
                </div>
                <div className='detailscardabout'>
                    <h3> {translations[language]?.friends}</h3>
                    <p> {translations[language]?.friendParagraph}
                    </p>
                </div>
            </div>
            <div className='cardabout'>
                <div className='imgcardabout'>
                   <img src={delivery} alt="delivery" />
                </div>
                <div className='detailscardabout'>
                    <h3>  {translations[language]?.Fastshipping} </h3>
                    <p>  {translations[language]?.offer}
                    </p>
                </div>
            </div>
          </div>
        </div>

        <div className="footerr footerPhr">
            <div className=" header-container ">
              <div className="flexFooter">
                <div className="cartfooter">
                  <div className="important">
                    <h1>{translations[language]?.important}</h1>
                    <Link className="footerlink">{translations[language]?.privacy} </Link>
                    <Link className="footerlink">{translations[language]?.cookies} </Link>
                    <Link className="footerlink">{translations[language]?.terms} </Link>
                  </div>
                  <div className="information">
                    <h1>{translations[language]?.information}</h1>
                    <h2>
                    {translations[language]?.pfooter}
                    </h2>
                  </div>
                </div>
                <div className="cartfooter cartfootertwo">
                  <div className="important">
                    <h1>{translations[language]?.contactdetails}</h1>
                    <h2>
                    {translations[language]?.require}
                    </h2>
                  </div>
                  <div className="address">
                    <div className="flexaddress">
                      <img src={address} />
                      <h2>{translations[language]?.addresscontact}</h2>
                    </div>
                    <h2>
                    {translations[language]?.addfooterone} <br />
                    {translations[language]?.addfootertwo}
                    </h2>
                  </div>
                  <div className="flexphoneemail">
                    <div className="address">
                      <div className="flexaddress">
                        <img src={phone} />
                        <h2>{translations[language]?.phonenumber}:</h2>
                      </div>
                      <h2>00212689831227</h2>
                    </div>
                    <div className="address">
                      <div className="flexaddress">
                        <img src={email} />
                        <h2>{translations[language]?.email}:</h2>
                      </div>
                      <h2>contact@vitaparapharma.com</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
