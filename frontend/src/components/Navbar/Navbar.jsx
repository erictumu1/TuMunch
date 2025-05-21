import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // <-- Import toast from react-toastify
import { assets, menu_list } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './Navbar.css';

const Navbar = ({ setShowLogin, setCategory }) => {
  const { cartItems, token, setToken, userName, setUserName } = useContext(StoreContext); // Make sure setUserName is destructured
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : '';
  }, [searchOpen]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const appDownloadEl = document.getElementById('app-download');
      const footerEl = document.getElementById('footer');

      if (appDownloadEl && footerEl) {
        const appDownloadTop = appDownloadEl.offsetTop;
        const footerTop = footerEl.offsetTop;

        if (scrollPosition >= footerTop - 100) {
          setActiveSection('footer');
        } else if (scrollPosition >= appDownloadTop - 100) {
          setActiveSection('app-download');
        } else {
          setActiveSection('home');
        }
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUserName(null);

    toast.success("You have been logged out successfully!", {
      style: {
        background: 'white',
        color: 'green',
      },
    });

    navigate("/");
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ').filter(n => n);
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = menu_list.filter(item =>
      item.menu_name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleSearchResultClick = (itemName) => {
    setCategory(itemName);
    handleSearchToggle();

    const exploreSection = document.getElementById('explore-menu');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNavScroll = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className='navbar-menu'>
        <Link
          to='/'
          className={activeSection === 'home' ? 'active-link' : ''}
        >
          home
        </Link>
        {token && (
          <Link
            to='/myorders'
            className={location.pathname === '/myorders' ? 'active-link' : ''}
          >
            orders
          </Link>
        )}
      <span
        className={`nav-link ${activeSection === 'app-download' ? 'active-link' : ''}`}
        onClick={() => handleNavScroll('app-download')}
      >
        mobile-app
      </span>
      <span
        className={`nav-link ${activeSection === 'footer' ? 'active-link' : ''}`}
        onClick={() => handleNavScroll('footer')}
      >
        contact us
      </span>
      </ul>  
      <div className='navbar-right'>
        {location.pathname !== '/myorders' && location.pathname !== '/cart' && (
          <div style={{ position: 'relative' }}>
            <img
              src={assets.search_icon}
              alt="search"
              className='search-icon'
              onClick={handleSearchToggle}
              style={{ cursor: 'pointer' }}
            />
            {searchOpen && <div className="search-backdrop" onClick={handleSearchToggle} />}
            {searchOpen && (
              <div className="search-dropdown" style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                background: 'transparent',
                border: 'none',
                borderRadius: '0',
                width: '250px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000,
                padding: '0'
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search menu..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '8px',
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    color: 'black',
                    border: '1.5px solid green',
                    outline: 'none'
                  }}
                />
                {searchQuery && searchResults.length === 0 && (
                  <p style={{ padding: '8px', color: 'gray' }}>
                    Item isn't available currently.
                  </p>
                )}
                {searchResults.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {searchResults.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSearchResultClick(item.menu_name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 0',
                          borderBottom: '1px solid #eee',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={item.menu_image} alt={item.menu_name} style={{
                          width: '40px',
                          height: '40px',
                          marginRight: '10px',
                          objectFit: 'cover'
                        }} />
                        <span style={{ color: 'white' }}>{item.menu_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
        {token && (
          <div className='navbar-search-icon'>
            <Link to='/cart'>
              <img src={assets.basket_icon} alt="" className='basket-icon' />
            </Link>
          {getCartItemCount() > 0 && (
            <Link to="/cart" className="cart-count-link">
              <div className="cart-count">{getCartItemCount()}</div>
            </Link>
          )}
          </div>
        )}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='navbar-profile'>
            <div className="user-initials-circle">{getInitials(userName)}</div>
            <ul className="nav-profile-dropdown">
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" /><p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
