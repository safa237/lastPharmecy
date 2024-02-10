import React from "react";
import { Button, Container, Table, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../rtk/slices/Cart-slice";
import { useEffect } from "react";
import NavHeader from "../../components/NavHeader";
import {  useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setLanguage , selectLanguage , selectTranslations } from "../../rtk/slices/Translate-slice";
import logo from '../../images/Vita Logo2.png' ;
import { FaTrash } from "react-icons/fa";
import { setSearchTerm } from "../../rtk/slices/Search-slice";
import { selectToken } from "../../rtk/slices/Auth-slice";
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { FaPlus , FaMinus } from "react-icons/fa";
import axios from "axios";
import { Modal  } from "react-bootstrap";
import './cart.css';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  //const cart = useSelector(state => state.cart);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(1);

  const cartProducts = useSelector((state) => state.cart);

  const [showModal, setShowModal] = useState(false);
const [modalMessage, setModalMessage] = useState('');
const [itemToDelete, setItemToDelete] = useState(null);

const handleCloseModal = () => setShowModal(false);



const handleDeleteFromCart = (productId) => {
  setModalMessage("Are you sure you want to delete this item from the cart?");
  setShowModal(true);
  setItemToDelete(productId);
};

const handleDeleteConfirmation = async () => {
  await handleDeleteItem(itemToDelete);
  setShowModal(false);
};

  
const handleIncrement = (productId) => {
  setCart(prevCart => {
    return prevCart.map(item => {
      if (item.productId == productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
  });
};
const handleDecrement = (productId) => {
  setCart(prevCart => {
    return prevCart.map(item => {
      if (item.productId == productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
  });
};

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

 /* const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );*/

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  


  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };


  /*const totalprice = cart.reduce((acc, product) => {
    acc += product.price * product.quantity;
    return acc;
  }, 0);


  

  const handleDeleteFromCart = (productId) => {
    dispatch(deleteFromCart({ id: productId }));
  };*/
  

  const handleConfirmClick = () => {
    navigate('/order/confirm');
  };

  const [cart, setCart] = useState([]);

  const [promoCode, setPromoCode] = useState('');
  const bearerToken = useSelector(selectToken);
  const [numItems, setNumItems] = useState(0);

  const fetchUserCart = async () => {
    try {
      
      const response = await axios.get('https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/my', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept-Language': language,
        },
      });
  
      const cartData = response.data.data; 
      
      if (cartData && cartData.cart) {
        setCart(cartData.cart.cartItems || []); 
        calculateTotalPrice(cartData.cart.cartItems); 
        console.log('Success fetch carts', cartData.cart.cartItems);
        setNumItems(cartData.cart.cartItems.length);
      } else {
        console.error('Error fetching user cart: Unexpected response structure');
      }
      console.log('success fetch carts' , response.data.data.cart.cartItems);
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  };
  
  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(`https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Accept-Language': language,
        },
      });
      await fetchUserCart();
      console.log('success delete from cart ', productId);
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };

  const handleCancelDeletion = () => {
    setShowModal(false);
    setItemToDelete(null);
  };


  const calculateTotalPrice = (cartItems) => {
    const totalPrice = cartItems.reduce((acc, item) => {
      return acc + item.productPrice * item.quantity;
    }, 0);
    setTotalPrice(totalPrice);
  };


  const handleAddToFavorites = async (productId) => {
    try {
      const response = await axios.put( 
        `https://ecommerce-1-q7jb.onrender.com/api/v1/user/wishlist/add/${productId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        }
      );
      await handleDeleteFromCart(productId); 
      console.log('Response:', response.data); 
    } catch (error) {
      console.log('Error adding product to wishlist: ', error.message);
    }
  };
  

  useEffect(() => {
    fetchUserCart();
  }, []);

  useEffect(() => {
    calculateTotalPrice(cart);
    if (cart.length > 0) {
      setQuantity(cart[0].quantity);
    }
  }, [cart]);
 

  const [updatedCart, setUpdatedCart] = useState([]);

  const handleSave = async (productId, product) => {
   
    const cartItem = {
      productId: productId,
      quantity: product.quantity, 
    };
  
    try {
      const response = await axios.put(
        'https://ecommerce-1-q7jb.onrender.com/api/v1/user/cart/update',
        cartItem,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Product added to cart:', response.data);
      await fetchUserCart();
      setQuantity(quantity);
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
    }
  };

  
  
  return(
    <div>
       <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        //filteredProducts={filteredProducts}
        handleProductClick={handleProductClick}
        cartNumber={cart.length}
      />

      <div className="green-containerr cartGreen ">
        <div className="header-container">
          <div className="flexContainerCart">
          
          <div className="flexcart">
          {cart?.map((product) => (<div className="productcart" key={product.productId}>
              <div className="flexOnecart">
                <div className="imgcart">
                <Image
                  src={product.pictureUrl}
                  alt="Product poster"
                  style={{ width: "100%", height: "60%" }}
  />
                </div>
                <div className="infocartone">
                  <div  className="namecart" ><h4>{product.productName}</h4></div>
                  <h5>{product.productPrice}$</h5>
                  <h5>quantity : {product.quantity}</h5>

                  <div className="countercart">
                  <button
    style={{ backgroundColor: '#3EBF87', color: 'white' }}
    onClick={() => handleDecrement(product.productId)}
  >
    <FaMinus />
  </button>
  <span>{product.quantity}</span>
  <button
    style={{ backgroundColor: '#3EBF87', color: 'white' }}
    onClick={() => handleIncrement(product.productId)}
  >
    <FaPlus />
  </button>
  <button
        className="save-button"
        onClick={() => handleSave(product.productId, product)}
      >
        save
      </button>
                </div>
                </div>
                <div className="infocarttwo">
                  <div className="namecart" >
                  
              <FaTrash style={{color: 'red' , fontSize:'20px'}} 
              onClick={() => handleDeleteFromCart(product.productId)}/>
                  </div>
                  <div className="namecart" >
                  
              <FaHeart style={{color: '#3EBF87' , fontSize:'20px'}} 
              onClick={() => handleAddToFavorites(product.productId)} />
                  </div>

                  
                </div>
              </div>
            </div> ))}
          </div>
          <div className="total">
          <h4>{translations[language]?.totalprice} {totalPrice.toFixed(2)}</h4>
              
              <button className="confirmbtn" onClick={handleConfirmClick}>{translations[language]?.confirm}</button>
            </div>
            </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDeletion}>
            No
          </Button>
          <Button variant="primary" onClick={handleDeleteConfirmation}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cart;