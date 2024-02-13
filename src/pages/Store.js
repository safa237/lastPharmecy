import React from 'react';
import './stylehome.css'; 
import logo from '../images/Vita Logo2.png' ;
import product from '../images/product.png' ;
import { FaSearch } from 'react-icons/fa';
import { FaHeart, FaShoppingCart , FaEye } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import Slider from './slider/Slider';
import StarRating from './rate/StarRating';
import axios from 'axios';
import { useEffect , useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { fetchProducts , setProducts} from '../rtk/slices/Product-slice';
//import { addToWishlist , removeFromWishlist  } from '../rtk/slices/Wishlist-slice';
//import { selectWishlist } from '../rtk/slices/Wishlist-slice';
import DetailsDialog from './products/DetailsDialog';
import { addToCart } from '../rtk/slices/Cart-slice';
import { CiStar } from "react-icons/ci";
import NavHeader from '../components/NavHeader';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useLocation } from 'react-router-dom';
import email from '../images/Email icon.png';
import address from '../images/Location icon.png';
import phone from '../images/phone icon.png';
import SidebarUser from '../components/SidebarUser';
import { addToWishlist , removeFromWishlist } from '../rtk/slices/Wishlist-slice';
import { clearWishlist } from '../rtk/slices/Wishlist-slice';
import loginimg from '../images/loginIcon.png';
import logoutimg from '../images/logouticon.png';
import cartimg from '../images/Cart.png';
import { selectToken } from '../rtk/slices/Auth-slice';
import { setLanguage , selectLanguage , selectTranslations } from '../rtk/slices/Translate-slice';
import './store.css';
import WhatsAppIcon from '../components/Whatsapp';
import Dropdown from "react-bootstrap/Dropdown";


function Store  ()  {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const cart = useSelector(state => state.cart);
  

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [mainCategory, setMainCategory] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState(0);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(0);
  const [productsWithMainCat, setProductsWithMainCat] = useState([]);
  const [productsWithSubCat, setProductsWithSubCat] = useState([]);
  const [mainCategoryText, setMainCategoryText] = useState(translations[language]?.main );
  const [subCategoryText, setSubCategoryText] = useState(translations[language]?.sub );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const userId = useSelector((state) => state.auth.id);
  const bearerToken = useSelector(selectToken);

  
  const products = useSelector((state) => state.products.products);

  const [ratingFilter, setRatingFilter] = useState(0);


 
  const handlePriceRangeChange = (event) => {
    const { value } = event.target;
    setPriceRange((prevRange) => ({ ...prevRange, max: value }));
  };
  
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    fetchUserFavourite();
    fetchMianCategory();
    fetchSubCategory();
  }, []);
  
  const isProductInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };
  
    
  const handleAddToFavorites = async (productId) => {
    try {
      if (isProductInWishlist(productId)) {
       
        await handleDeleteFromWishlist(productId);
      } else {
        
        await axios.put(
          `http://195.35.28.106:8080/api/v1/user/wishlist/add/${productId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'Accept-Language': language,
            },
          }
        );
        await fetchUserFavourite();
      }
    } catch (error) {
      console.error('Error updating product in wishlist: ', error.message);
    }
  };
  
  const handleDeleteFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://195.35.28.106:8080/api/v1/user/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Accept-Language': language,
        },
      });
      await fetchUserFavourite();
    } catch (error) {
      console.error('Error deleting product from wishlist:', error);
    }
  };
  
  const fetchUserFavourite = async () => {
    try {
      const language = 'en';
      const response = await axios.get('http://195.35.28.106:8080/api/v1/user/wishlist/my', {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Accept-Language': language,
        },
      });
  
      const favouriteData = response.data.data;
  
      if (favouriteData && favouriteData.wishlist) {
        setWishlist(favouriteData.wishlist.wishlistItems || []);
        console.log('Success fetch wishlist', favouriteData.wishlist.wishlistItems);
      } else {
        console.error('Error fetching user favourite: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  };
  
  
  

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
        setSelectedCategoryId(null); 
        checkLoggedInStatus();
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [language]);
  



  const checkLoggedInStatus = () => {
    const userToken = localStorage.getItem('token');
    setIsLoggedIn(!!userToken);
  };


  
  const handleLogout = () => {
    localStorage.removeItem('token'); 
   
    setIsLoggedIn(false); 
    setIsDropdownOpen(false); 
   
  };

  const rating = product.rate;

  
  /*const handleRatingChange = (newRating) => {
    setRatingFilter((prevRating) => (prevRating === newRating ? 0 : newRating));
  };*/

  const handleRatingChange = (newRating) => {
    setRatingFilter((prevRating) => (prevRating === newRating ? 0 : newRating));
  };
  
  
  

  const handleAddToCart = async (productId, product) => {
    if (!isLoggedIn) {
      alert('Please sign in to add to cart.');
      return;
    }
  
    const cartItem = {
      productId: productId,
      quantity: 1, 
    };
  
    try {
      const response = await axios.put(
        'http://195.35.28.106:8080/api/v1/user/cart/update',
        cartItem,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        }
      );
  
      console.log('Product added to cart:', response.data);
  
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
    }
  };
 

  const detailsBtn = () => {
    if (!isLoggedIn) {
      alert('Please sign in to view details.');
      return;
    }
    
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  
  
 

  /*const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };*/

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
 /* const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryId(categoryId);
     
    navigate(`/store?category=${categoryId}`); 
    dispatch(fetchProducts(categoryId));
  };*/

  const [selectedCategory, setSelectedCategory] = useState(null);
  

  const handleCategoryFilter = async (categoryId) => {
    try {
      let url;
      if (categoryId === null) {
        // If categoryId is null, fetch all products
        url = 'http://195.35.28.106:8080/api/v1/public/product/all';
        setSelectedCategoryId(null); // Set selectedCategoryId to null
      } else {
        url = `http://195.35.28.106:8080/api/v1/public/category/${categoryId}`;
        setSelectedCategoryId(categoryId);
      }
  
      const response = await fetch(url, {
        headers: {
          'Accept-Language': language,
        },
      });
      const data = await response.json();
  
      if (response.ok) {
        dispatch(setProducts(data.data.products));
      } else {
        console.error('Error fetching products by category:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };
  


  const handleSaleButtonClick = () => {
    const saleProducts = products.filter(product => product.discount);
    dispatch(setProducts(saleProducts));
  };
  
  const handleAllButtonClick = () => {
    dispatch(fetchProducts());
  };
  
  

  

  /*const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    //const matchesCategory = selectedCategoryId ? product.categoryId === selectedCategoryId : true;
    const matchesPriceRange =
      product.price >= priceRange.min && product.price <= priceRange.max;
    
    const matchesRating = ratingFilter
      ? product.rating >= ratingFilter && product.rating < ratingFilter + 1
      : true;
    return matchesSearch  && matchesPriceRange && matchesRating ;
  });*/

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://195.35.28.106:8080/api/v1/public/category/all', {
          headers: {
            'Accept-Language': language,
          },
        });
        setCategories(response.data.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [language]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTermFromUrl = queryParams.get('search') || '';
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts());
        checkLoggedInStatus();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setSearchTerm(searchTermFromUrl);

    const categoryIdFromUrl = queryParams.get('category');
  setSelectedCategoryId(categoryIdFromUrl ? parseInt(categoryIdFromUrl) : null);
  }, [language, searchTermFromUrl]);
  
  // ...

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Update the URL when the search term changes
    navigate(`/store?search=${term}`);
  };


  const [value, setValue] = useState(50);

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  






  const [selectedCategoryIdTwo, setSelectedCategoryIdTwo] = useState(null);


  const handleSelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    handleCategoryFilter(categoryId);
  };

  
 /* const handleSelectTwo  = (categoryId) => {
    setSelectedCategoryIdTwo(categoryId);
    navigate(`/store?category=${categoryId}`);
  };*/
  
  const handleSearchChangeInternal = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };
  /*const handleSearchSubmit = () => {
    
    const productsInSelectedCategory = filteredProducts.filter(product => product.categoryId === selectedCategoryId);
  
    
    const searchTermLowerCase = searchTerm ? searchTerm.toLowerCase() : '';
    const productsMatchingSearch = productsInSelectedCategory.filter(product => {
      const productNameLowerCase = product.name ? product.name.toLowerCase() : '';
      return productNameLowerCase.includes(searchTermLowerCase);
    });
  
    if (selectedCategoryId !== null && productsMatchingSearch.length === 0) {
      setProductExistsInCategory(false);
      setShowErrorMessage(true);
      setTimeout(resetErrorMessage, 3000);
    } else {
      navigate(`/store?search=${searchTerm}${selectedCategoryId !== null ? `&category=${selectedCategoryId}` : ''}`);
    }
  };*/
  const [productExistsInCategory, setProductExistsInCategory] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const resetErrorMessage = () => {
    setShowErrorMessage(false);
    setProductExistsInCategory(true); 
  };

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const [userRating, setUserRating] = useState(0);
  


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
      <div className="page-container">
      {/* Header Container */}
      <NavHeader
        userId={userId}
        searchTermm={searchTerm}
        handleSearchChange={handleSearchChange}
        //filteredProductss={filteredProducts}
        handleProductClick={handleProductClick}
      />
  
      {/* Green Container */}
      <div className="green-containerr">
       
        <div className='home-containerr testtt'>
        <WhatsAppIcon />

        <div>
              <div className=" mx-auto  w-[50%] h-[200px] flex flex-row gap-3">
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

         <div className='store-flex'>
         {loading && (
      <div className="loading-spinner" style={{width: '50px' , height: '50px' , marginTop: '10px'}}>
      
      </div>
    )}

    {!loading && selectedMainCat === 0 && selectedSubCat === 0 && (
          <div className="card-store">
        {products.map((product) => {
  const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesPriceRange =
    product.price >= priceRange.min && product.price <= priceRange.max;

  const matchesRating = ratingFilter
    ? Math.floor(product.rating) === ratingFilter
    : true;

  if (matchesRating && matchesPriceRange && matchesSearch ) {
    return (
      <div className="cards" key={product.productId}>
        <div className="card-body">
          <div className="card-icons">
            <FaHeart
              onClick={() => handleAddToFavorites(product.productId)}
              style={{ color: isProductInWishlist(product.productId) ? 'red' : '#3EBF87' }}
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
          <div className='card-info card-infoStore'>
            <h2>{product.name}</h2>
            <div className='rate'>
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
              {product.discount && <div className="old-price">{`$${product.price}`}</div>}
              {!product.discount && <div className="price">{`$${product.price}`}</div>}
            </div>
          </div>
          <button
            className="proBtn"
            onClick={() => handleAddToCart(product.productId, product)}
          >
            add to cart
          </button>
        </div>
      </div>
    );
  }
})}
          </div>
     )}


{!loading && selectedMainCat > 0 && selectedSubCat === 0 && (
          <div className="card-store">
            
        { productsWithMainCat.length > 0 &&
        productsWithMainCat.map((product) => {
  const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesPriceRange =
    product.price >= priceRange.min && product.price <= priceRange.max;

  const matchesRating = ratingFilter
    ? Math.floor(product.rating) === ratingFilter
    : true;

  if (matchesRating && matchesPriceRange && matchesSearch ) {
    return (
      <div className="cards" key={product.productId}>
        <div className="card-body">
          <div className="card-icons">
            <FaHeart
              onClick={() => handleAddToFavorites(product.productId)}
              style={{ color: isProductInWishlist(product.productId) ? 'red' : '#3EBF87' }}
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
          <div className='card-info card-infoStore'>
            <h2>{product.name}</h2>
            <div className='rate'>
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
              {product.discount && <div className="old-price">{`$${product.price}`}</div>}
              {!product.discount && <div className="price">{`$${product.price}`}</div>}
            </div>
          </div>
          <button
            className="proBtn"
            onClick={() => handleAddToCart(product.productId, product)}
          >
            add to cart
          </button>
        </div>
      </div>
    );
  }
})}
          </div>
     )}

{!loading && selectedMainCat > 0 && selectedSubCat > 0 && (
          <div className="card-store">
        { productsWithSubCat.length > 0 &&
        productsWithSubCat.map((product) => {
  const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesPriceRange =
    product.price >= priceRange.min && product.price <= priceRange.max;

  const matchesRating = ratingFilter
    ? Math.floor(product.rating) === ratingFilter
    : true;

  if (matchesRating && matchesPriceRange && matchesSearch ) {
    return (
      <div className="cards" key={product.productId}>
        <div className="card-body">
          <div className="card-icons">
            <FaHeart
              onClick={() => handleAddToFavorites(product.productId)}
              style={{ color: isProductInWishlist(product.productId) ? 'red' : '#3EBF87' }}
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
          <div className='card-info card-infoStore'>
            <h2>{product.name}</h2>
            <div className='rate'>
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
              {product.discount && <div className="old-price">{`$${product.price}`}</div>}
              {!product.discount && <div className="price">{`$${product.price}`}</div>}
            </div>
          </div>
          <button
            className="proBtn"
            onClick={() => handleAddToCart(product.productId, product)}
          >
            add to cart
          </button>
        </div>
      </div>
    );
  }
})}
          </div>
     )}
           
          <div className='storeside'>
            <p></p>
          <div >
            <div style={{marginBottom: '30px' }}>
          <h5 style={{ color : 'black'}}>{translations[language]?.rating}</h5>
          <StarRating
              initialRating={ratingFilter}
              onRatingChange={handleRatingChange}
              isClickable={true} 
            />
           </div>
          <div style={{marginBottom: '30px' }}>
           <h5 style={{ color : 'black'}}>{translations[language]?.price} : {priceRange.max}</h5>
   <div  className="range-slider">
      <input
        type="range"
        min="0"
        max="10000"
        value={priceRange.max}
        onChange={handlePriceRangeChange}
      />
     
    </div>
    </div>
         

<h5 style={{marginTop: '10px'}}>sale products</h5>

<div className='filterCatdiv'>
          <div className='rateFilter'>
          <button
                    color="primary"
                    onClick={handleSaleButtonClick}
                    className='filterbycat'
                  >
                    Sale Products
                  </button>

                  <button
                    color="primary"
                    onClick={handleAllButtonClick}
                    className='filterbycat'
                  >
                    All Products
                  </button>
 
</div>
</div>

          
          </div>
          </div>
          
      </div>
  
          <div className='marks'>
           
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
      <DetailsDialog
          isOpen={detailsOpen}
          onCancel={handleCancelDetails}
          product={selectedProduct}
          rating = {rating}
       />
    </div>
    );
};

export default Store;