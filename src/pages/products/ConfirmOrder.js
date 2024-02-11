
import React from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  setLanguage,
  selectLanguage,
  selectTranslations,
} from "../../rtk/slices/Translate-slice";
import { FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import logo from "../../images/Vita Logo2.png";
import { FaTrash } from "react-icons/fa";
import { Button, Container, Table, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../rtk/slices/Cart-slice";
import { useEffect } from "react";
import product from "../../images/product.png";
import NavHeader from "../../components/NavHeader";
import axios from "axios";
import { selectToken } from "../../rtk/slices/Auth-slice";
import { Modal } from "react-bootstrap";
import "./confirmOrder.css";
import WhatsAppIcon from "../../components/Whatsapp";
import email from "../../images/Email icon.png"
import addresss from "../../images/Location icon.png";
import phone from "../../images/phone icon.png";

function ConfirmOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const translations = useSelector(selectTranslations);
  const products = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const bearerToken = useSelector(selectToken);
  const [countries, setCountries] = useState([]);
  const [newAddress, setNewAddress] = useState({
    country: "MOROCCO",
    city: "",
    region: "",
    street: "",
    zipCode: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
    getCounries();
  }, [language]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };

  const totalprice = cart.reduce((acc, product) => {
    acc += product.price * product.quantity;
    return acc;
  }, 0);

  const handleDeleteFromCart = (productId) => {
    dispatch(deleteFromCart({ id: productId }));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const allProducts = useSelector((state) => state.products);
  const cartProducts = useSelector((state) => state.cart);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term.toLowerCase());
  };

  const handleProductClick = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    street: "",
    city: "",
    region: "",
    postalCode: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [address, setAdress] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(
        "http://195.35.28.106:8080/api/v1/user/address/all",
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        }
      );
      // console.log("addreses", response.data);
      setAdress(response.data.data.addresses);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => setShowModal(false);

  const createOrder = async (addressId) => {
    try {
      const response = await axios.post(
        `http://195.35.28.106:8080/api/v1/user/order/cart/on/${addressId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        }
      );

      if (response.status === 200) {
        setModalMessage("Order submitted successfully");
        setShowModal(true);
      } else {
        console.log("Error submitting order:", response.data);

        if (response.data && response.data.message) {
          setModalMessage(` ${response.data.message}`);
          setShowModal(true);
        } else {
          console.error("Unknown error:", response.data);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmit = async (addressId) => {
    createOrder(addressId);
    console.log(addressId);
  };

  const addNewAddress = async () => {
    try {
      const response = await axios.post(
        "http://195.35.28.106:8080/api/v1/user/address/new",
        newAddress,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        }
      );
      console.log("adding new address successfully", response.data);
      fetchUserAddresses();
      setNewAddress({
        country: "MOROCCO",
        city: "",
        region: "",
        street: "",
        zipCode: "",
      });
    } catch (error) {
      console.log("error in add newAddress >>", error);
    }
  };

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;

    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [fieldName]: value,
    }));

    console.log(newAddress);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(
        `http://195.35.28.106:8080/api/v1/user/address/delete/${addressId}`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        }
      );
      console.log("Deleted address successfully", response.data);
      fetchUserAddresses();
    } catch (error) {
      console.log("error in Delete Address >>", error);
    }
  };

  const getCounries = async () => {
    try {
      const response = await axios.get(
        "http://195.35.28.106:8080/api/v1/public/country/all",
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        }
      );
      console.log("countries>>", response.data.data.countries);
      setCountries(response.data.data.countries);
    } catch (error) {
      console.log("error in getting countries", error.message);
    }
  };

  return (
    <div className="confirmPage">
      <NavHeader
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleProductClick={handleProductClick}
      />

      <Container style={{ marginTop: "50px" }}>
      <div className=" testtt">
      <WhatsAppIcon />
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th className="p-4">country</th>
              <th className="p-4">city</th>
              <th className="p-4">region</th>
              <th className="p-4">street</th>
              <th className="p-4">zipCode</th>
              <th className="p-4">action</th>
              <th className="p-4">delete</th>
            </tr>
          </thead>
          <tbody>
            {address.map((item) => (
              <tr>
                <td>{item.country}</td>
                <td>{item.city}</td>
                <td>{item.region}</td>
                <td>{item.street}</td>
                <td>{item.zipCode}</td>
                <td>
                  <button
                    onClick={() => handleSubmit(item.addressId)}
                    className="useaddress"
                  >
                    confirm order in this address
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteAddress(item.addressId)}
                    className="useaddress2"
                  >
                    Delete this address
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          {address.length > 4 ? (
            <h3>Max addresses 5</h3>
          ) : (
            <button
              className="useaddress"
              onClick={() => setShowForm(!showForm)}
            >
              Adding New Address
            </button>
          )}

          {showForm && (
            <>
              <Table striped bordered hover size="sm" className="mt-4">
                <thead>
                  <tr>
                    <th className="p-4">country</th>
                    <th className="p-4">city</th>
                    <th className="p-4">region</th>
                    <th className="p-4">street</th>
                    <th className="p-4">zipCode</th>
                    <th>action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => handleInputChange(e, "country")}
                        value={"MOROCCO"}
                      >
                        <option value="MOROCCO" key={"MOROCCO"}>
                          Morocco
                        </option>
                        {/* {Object.keys(countries).map((countryKey) => (
                          <option
                            key={countryKey}
                            value={countries[countryKey]}
                          >
                            {countries[countryKey]}
                          </option>
                        ))} */}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => handleInputChange(e, "city")}
                        value={newAddress.city}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => handleInputChange(e, "region")}
                        value={newAddress.region}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => handleInputChange(e, "street")}
                        value={newAddress.street}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => handleInputChange(e, "zipCode")}
                        value={newAddress.zipCode}
                      />
                    </td>
                    <td>
                      <button
                        className="useaddress"
                        onClick={() => addNewAddress()}
                      >
                        Save this Address
                      </button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </div>
        </div>
      </Container>

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
                      <img src={addresss} />
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default ConfirmOrder;

