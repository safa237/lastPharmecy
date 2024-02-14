import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { selectLanguage , selectTranslations , setLanguage } from '../rtk/slices/Translate-slice';
import { useSelector } from 'react-redux';
import './advertesment.css';

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    arrows: false,
    adaptiveHeight: true,
    customPaging: i => (
      <div className="slider-dot">
        <div className={`dot ${i === 0 ? 'active' : ''}`}></div>
      </div>
    )
  };

  const language = useSelector(selectLanguage);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://195.35.28.106:8080/api/v1/public/advertisement/all', {
          headers: {
            'Accept-Language': language,
          }
        });
        setImages(response.data.data.advertisements.map(advertisement => ({
          id: advertisement.adId,
          src: advertisement.imgUrl,
          alt: advertisement.description
        })));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="slider-container" style={{ overflowY: 'hidden' }}>
      <Slider style={{overflowY: 'hidden'}} {...settings}>
        {images.map(image => (
          <div key={image.id} className="slider-image-container">
            <img
              src={image.src}
              alt={image.alt}
              className="slider-image"
              style={{ height: '200px', width: '400px', objectFit: 'contain' }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
