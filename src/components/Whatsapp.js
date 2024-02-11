// WhatsAppIcon.js

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppIcon = () => {
  return (
    <div className="whatsicon">
      <a href="https://web.whatsapp.com/send?phone=+201122880765" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp style={{ color: '#3EBF87', fontSize: '70px' }} />
      </a>
    </div>
  );
};

export default WhatsAppIcon;
