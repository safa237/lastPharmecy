import React, { useEffect, useState } from "react";
import "./stylehome.css";
import logo from "../images/Vita Logo2.png";
import product from "../images/product.png";
import { FaSearch } from "react-icons/fa";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import Slider from "./slider/Slider";
import StarRating from "./rate/StarRating";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { IoMdAppstore } from "react-icons/io";

import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../rtk/slices/Translate-slice";
import {
  fetchProducts,
  selectProducts,
  selectProductIds,
} from "../rtk/slices/Product-slice";
//import {  removeFromWishlist } from '../rtk/slices/Wishlist-slice';
//import { selectWishlist } from '../rtk/slices/Wishlist-slice';
import DetailsDialog from "./products/DetailsDialog";
import { addToCart, deleteFromCart } from "../rtk/slices/Cart-slice";
//import { clearWishlist } from '../rtk/slices/Wishlist-slice';
import { clearCart } from "../rtk/slices/Cart-slice";
import { logoutAction, setAuthData } from "../rtk/slices/Auth-slice"; // Assuming your auth slice includes setAuthData
import NavHeader from "../components/NavHeader";
import email from "../images/Email icon.png";
import address from "../images/Location icon.png";
import phone from "../images/phone icon.png";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { jwtDecode } from "jwt-decode";
//import { loadWishlistFromStorage } from '../rtk/slices/Wishlist-slice';
import { setSearchTerm } from "../rtk/slices/Search-slice";
import { selectUserId } from "../rtk/slices/User-slice";
//import { addToWishlist } from '../rtk/slices/Wishlist-slice';
import {
  addToWishlist,
  removeFromWishlist,
} from "../rtk/slices/Wishlist-slice";
import { clearWishlist } from "../rtk/slices/Wishlist-slice";
import HorizontalScroll from "../components/Carousel";
import { selectToken } from "../rtk/slices/Auth-slice";
import { Modal, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import WhatsAppIcon from "../components/Whatsapp";
import Dropdown from "react-bootstrap/Dropdown";
import Advertesment from "../components/Advertesment";
import Footer from "../components/Footer";


function Home() {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(isLoggedIn);
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(isLoggedIn);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const userId = useSelector((state) => state.auth.id);
  const bearerToken = useSelector(selectToken);
  const isUserLoggedIn = useSelector(selectToken) !== null;
  const products = useSelector((state) => state.products.products);
  const error = useSelector((state) => state.products.error);
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState(0);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(0);
  const [productsWithMainCat, setProductsWithMainCat] = useState([]);
  const [productsWithSubCat, setProductsWithSubCat] = useState([]);
  const [mainCategoryText, setMainCategoryText] = useState(translations[language]?.main );
  const [subCategoryText, setSubCategoryText] = useState(translations[language]?.sub );

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };
  const direction = useSelector((state) => state.translation.direction);

  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    fetchUserFavourite();
    console.log("CART", cart);
    fetchMianCategory();
    fetchSubCategory();
    setMainCategoryText(translations[language]?.main || translations['en']?.main);
  setSubCategoryText(translations[language]?.sub || translations['en']?.sub);
  }, [language, translations]);

  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const getCart = () => {};

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => setShowModal(false);

  const handleAddToFavorites = async (productId) => {
    try {
      if (!isUserLoggedIn) {
        setModalMessage("please sign in first");
        setShowModal(true);
        return;
      }
      if (isProductInWishlist(productId)) {
        await handleDeleteFromWishlist(productId);
      } else {
        const response = await axios.put(
          `http://195.35.28.106:8080/api/v1/user/wishlist/add/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
              "Accept-Language": language,
            },
          }
        );
        console.log("Response:", response.data); // Print the response data
        await fetchUserFavourite();
      }
    } catch (error) {
      console.log("Error adding product to wishlist: ", error);
    }
  };

  const handleDeleteFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `http://195.35.28.106:8080/api/v1/user/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Accept-Language": language,
          },
        }
      );
      await fetchUserFavourite();
    } catch (error) {
      console.error("Error deleting product from wishlist:", error);
    }
  };

  const fetchUserFavourite = async () => {
    try {
      const response = await axios.get(
        "http://195.35.28.106:8080/api/v1/user/wishlist/my",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
            "Accept-Language": language,
          },
        }
      );

      const favouriteData = response.data.data;

      if (favouriteData && favouriteData.wishlist) {
        setWishlist(favouriteData.wishlist.wishlistItems || []);
        console.log(
          "Success fetch wishlist",
          favouriteData.wishlist.wishlistItems
        );
      } else {
        console.error(
          "Error fetching user favourite: Unexpected response structure"
        );
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const handleAddToCart = async (productId, product) => {
    if (!isUserLoggedIn) {
      setModalMessage("please sign in first");
      setShowModal(true);
      return;
    }

    const cartItem = {
      productId: productId,
      quantity: 1,
    };

    try {
      const response = await axios.put(
        "http://195.35.28.106:8080/api/v1/user/cart/update",
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
            "Accept-Language": language,
          },
        }
      );

      setModalMessage("product added to cart");
      setShowModal(true);
      console.log("Product added to cart:", response.data);
      dispatch(addToCart(productId));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    dispatch(setSearchTerm(term));
  };

  const [favoriteStatus, setFavoriteStatus] = useState(
    JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {}
  );

  const saveFavoritesToLocalStorage = (userId, favorites) => {
    const userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {};
    localStorage.setItem(
      `favorites_${userId}`,
      JSON.stringify({ ...userFavorites, ...favorites })
    );
  };

  useEffect(() => {
    const savedFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || {};
    setFavoriteStatus(savedFavorites);
  }, [userId]);

  const handleDetailsClick = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setDetailsOpen(true);
  };

  const handleCancelDetails = () => {
    setDetailsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const rating = selectedProduct ? selectedProduct.rate : 0;

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };
  const fetchMianCategory = async () => {
    try {
      const response = await axios.get(
        "http://195.35.28.106:8080/api/v1/public/main/category/all",
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      console.log("success in fetching main Categoryies ", response.data.data);
      setMainCategory(response.data.data.mainCategories);
    } catch (error) {
      console.log("error in fetching main Category", error);
    }
  };
  const fetchSubCategory = async () => {
    try {
      const response = await axios.get(
        "http://195.35.28.106:8080/api/v1/public/category/all",
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      console.log(
        "success in fetching Sub Categoryies ",
        response.data.data.categories
      );
      setSubCategory(response.data.data.categories);
    } catch (error) {
      console.log("error in fetching Sub Category", error);
    }
  };
  const fetchProductsByMainCat = async (MC) => {
    try {
      const response = await axios.get(
        `http://195.35.28.106:8080/api/v1/public/product/main/category/${MC}`,
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      console.log(
        "success in fetching Products with Main Category ",
        response.data.data
      );
      setProductsWithMainCat(response.data.data.products);
    } catch (error) {
      console.log("error in fetching Products with Main Category", error);
    }
  };
  const fetchProductsBySubCat = async (MC) => {
    try {
      const response = await axios.get(
        `http://195.35.28.106:8080/api/v1/public/product/category/${MC}`,
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      console.log(
        "success in fetching Products with Sub Category ",
        response.data.data
      );
      setProductsWithSubCat(response.data.data.products);
    } catch (error) {
      console.log("error in fetching Products with Sub Category", error);
    }
  };
  const handleMainCatSelect = (id, name) => {
    console.log("Selected main Category id:", id);
    fetchProductsByMainCat(id);
    setSelectedMainCat(id);
    setMainCategoryText(name);
  };
  const handleSubCatSelect = (id, name) => {
    console.log("Selected Sub Category id:", id);
    fetchProductsBySubCat(id);
    setSelectedSubCat(id);
    setSubCategoryText(name);
  };
  const handleDeleteFilters = () => {
    setSelectedMainCat(0);
    setSelectedSubCat(0);
    setSubCategoryText('Sub Category');
    setMainCategoryText(translations[language]?.main );
  };

  return (
    <div className="     w-full">
      <div className=" sm:fixed   w-full  h-[100vh]  text-green-500  bg-white   lg:hidden ">
        <div className={`flexLanguage ${direction === "rtl" ? "rtl" : "ltr"}`}>
          <div className="languageInnav rightAlign">
            <select
              className="selectLang "
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="fr">Française</option>
              <option value="ar">لغه عربيه</option>
            </select>
          </div>
        </div>

        <div>
          <img src={logo} className="mx-auto" alt="logo" />
        </div>
        <h3 className="py-10  items-center text-center text-rap  ">
          {translations[language]?.experience}
        </h3>
        <h3 className="py-10  items-center text-center text-rap  ">
          {translations[language]?.download}
        </h3>
        <div className="w-20 h-20 mx-auto items-center mt-10 ">
          <IoLogoGooglePlaystore className="w-20 h-20  text-green-500 rounded-md pl-1  bg-slate-600" />
        </div>
        <div className="w-20 h-20 mx-auto items-center mt-10 ">
          <IoMdAppstore className="w-20 h-20  text-green-500 rounded-md   bg-slate-600" />
        </div>
      </div>
      <div className="page-container hidden lg:block">
        <NavHeader
          userId={userId}
          searchTermm={searchTerm}
          handleSearchChange={handleSearchChange}
          //filteredProductss={filteredProducts}
          handleProductClick={handleProductClick}
        />

        <div className="green-containerr">
          <div className="home-containerr testtt">
            <WhatsAppIcon />
            <Slider />
           
            <div className="titleProduct">
              <h1>{translations[language]?.magasin}</h1>
              <h2>{translations[language]?.learnmore}</h2>
            </div>
            {loading && (
              <div
                className="loading-spinner"
                style={{ width: "50px", height: "50px", marginTop: "10px" }}
              ></div>
            )}
            <div>
              <div className=" mx-auto my-10  w-[50%] h-[200px] flex flex-row gap-3">
                <Dropdown className=" w-[30%] h-full">
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className="w-[100%] text-white">
                    {mainCategoryText}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {mainCategory.map((item) => (
                      <Dropdown.Item
                        key={item.categoryId}
                        value={item.categoryId}
                        onClick={() => handleMainCatSelect(item.categoryId,item.name)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="w-[30%] h-full">
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className="w-[100%]">
                    {subCategoryText}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {subCategory.map((item) => (
                      <Dropdown.Item
                        key={item.categoryId}
                        value={item.categoryId}
                        onClick={() => handleSubCatSelect(item.categoryId,item.name)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <button
                  className="btn btn-success h-10 w-[30%]"
                  onClick={handleDeleteFilters}
                >
                  {translations[language]?.clear}
                </button>
              </div>
            </div>
            {!loading && selectedMainCat === 0 && selectedSubCat === 0 && (
              <div className="card-container">
                {products.map((product) => (
                  <div
                    style={{
                      borderRadius: "15%",
                      backgroundColor: "#fff",
                      marginBottom: "10px",
                      boxShadow: "5px 5px 5px #8080809e",
                    }}
                    className="card"
                    key={product.id}
                  >
                    <div className="card-body">
                      <div className="card-icons">
                        <FaHeart
                          onClick={() =>
                            handleAddToFavorites(product.productId)
                          }
                          style={{
                            color: isProductInWishlist(product.productId)
                              ? "red"
                              : "#3EBF87",
                          }}
                        />

                        <FaEye
                          className="cart-iconPro"
                          onClick={() => handleDetailsClick(product)}
                        />
                      </div>
                      <div className="card-imgstore">
                        <Link to={`/home/product/${product.productId}`}>
                          <img src={product.pictures[0]} alt="Product poster" />
                        </Link>
                      </div>
                      <div className=" card-infoStore">
                        <h2>{product.name}</h2>

                        <div className="rate">
                          <StarRating
                            initialRating={product.rating}
                            isClickable={false}
                          />
                          <h5>({product.reviews})</h5>
                        </div>
                        <div className="price">
                          {product.discount && (
                            <div className="discounted-price">{`$${product.afterDiscount}`}</div>
                          )}
                          {product.discount && (
                            <div className="old-price">{`$${product.price}`}</div>
                          )}
                          {!product.discount && (
                            <div className="price">{`$${product.price}`}</div>
                          )}
                        </div>
                      </div>
                      <button
                        className="proBtn"
                        onClick={() =>
                          handleAddToCart(product.productId, product)
                        }
                      >
                        add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && selectedMainCat > 0 && selectedSubCat === 0 && (
              <div className="card-container">
                {productsWithMainCat.length > 0 &&
                  productsWithMainCat.map((product) => (
                    <div
                      style={{
                        borderRadius: "15%",
                        backgroundColor: "#fff",
                        marginBottom: "10px",
                        boxShadow: "5px 5px 5px #8080809e",
                      }}
                      className="card"
                      key={product.id}
                    >
                      <div className="card-body">
                        <div className="card-icons">
                          <FaHeart
                            onClick={() =>
                              handleAddToFavorites(product.productId)
                            }
                            style={{
                              color: isProductInWishlist(product.productId)
                                ? "red"
                                : "#3EBF87",
                            }}
                          />

                          <FaEye
                            className="cart-iconPro"
                            onClick={() => handleDetailsClick(product)}
                          />
                        </div>
                        <div className="card-imgstore">
                          <Link to={`/home/product/${product.productId}`}>
                            <img
                              src={product.pictures[0]}
                              alt="Product poster"
                            />
                          </Link>
                        </div>
                        <div className=" card-infoStore">
                          <h2>{product.name}</h2>

                          <div className="rate">
                            <StarRating
                              initialRating={product.rating}
                              isClickable={false}
                            />
                            <h5>({product.reviews})</h5>
                          </div>
                          <div className="price">
                            {product.discount && (
                              <div className="discounted-price">{`$${product.afterDiscount}`}</div>
                            )}
                            {product.discount && (
                              <div className="old-price">{`$${product.price}`}</div>
                            )}
                            {!product.discount && (
                              <div className="price">{`$${product.price}`}</div>
                            )}
                          </div>
                        </div>
                        <button
                          className="proBtn"
                          onClick={() =>
                            handleAddToCart(product.productId, product)
                          }
                        >
                          add to cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {!loading && selectedMainCat > 0 && selectedSubCat > 0 && (
              <div className="card-container">
                {productsWithSubCat.length > 0 &&
                  productsWithSubCat.map((product) => (
                    <div
                      style={{
                        borderRadius: "15%",
                        backgroundColor: "#fff",
                        marginBottom: "10px",
                        boxShadow: "5px 5px 5px #8080809e",
                      }}
                      className="card"
                      key={product.id}
                    >
                      <div className="card-body">
                        <div className="card-icons">
                          <FaHeart
                            onClick={() =>
                              handleAddToFavorites(product.productId)
                            }
                            style={{
                              color: isProductInWishlist(product.productId)
                                ? "red"
                                : "#3EBF87",
                            }}
                          />

                          <FaEye
                            className="cart-iconPro"
                            onClick={() => handleDetailsClick(product)}
                          />
                        </div>
                        <div className="card-imgstore">
                          <Link to={`/home/product/${product.productId}`}>
                            <img
                              src={product.pictures[0]}
                              alt="Product poster"
                            />
                          </Link>
                        </div>
                        <div className=" card-infoStore">
                          <h2>{product.name}</h2>

                          <div className="rate">
                            <StarRating
                              initialRating={product.rating}
                              isClickable={false}
                            />
                            <h5>({product.reviews})</h5>
                          </div>
                          <div className="price">
                            {product.discount && (
                              <div className="discounted-price">{`$${product.afterDiscount}`}</div>
                            )}
                            {product.discount && (
                              <div className="old-price">{`$${product.price}`}</div>
                            )}
                            {!product.discount && (
                              <div className="price">{`$${product.price}`}</div>
                            )}
                          </div>
                        </div>
                        <button
                          className="proBtn"
                          onClick={() =>
                            handleAddToCart(product.productId, product)
                          }
                        >
                          add to cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          

          <div className="titleProduct">
              <h1>{translations[language]?.popular}</h1>
              <h2>{translations[language]?.featured}</h2>
            </div>
          <Advertesment />
          </div>

          <Footer />
        </div>
        <DetailsDialog
          isOpen={detailsOpen}
          onCancel={handleCancelDetails}
          product={selectedProduct}
          rating={rating}
        />
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Home;

