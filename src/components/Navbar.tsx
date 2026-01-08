import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useLanguageStore, useTranslation } from '@/store/languageStore';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Western Bite"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-display text-sm uppercase tracking-wider transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart, Language & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 group flex items-center gap-2"
            >
              <Globe className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              <span className="text-xs font-display text-foreground group-hover:text-primary-foreground hidden sm:inline">
                {t('lang.switch')}
              </span>
            </button>

            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary-foreground" />
              {totalItems > 0 && (
                <span className="cart-badge absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-slide-in-right">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-6 py-3 font-display text-sm uppercase tracking-wider transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-primary bg-secondary'
                      : 'text-foreground hover:text-primary hover:bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;