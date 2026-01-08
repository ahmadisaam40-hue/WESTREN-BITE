import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <img src={logo} alt="Western Bite" className="h-20 w-auto" />
            <p className="text-muted-foreground text-sm">
              Born in the West, bringing authentic Western flavors to Iraq.
              Experience the taste of the Wild West with every bite.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg text-primary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Baghdad, Iraq</span>
              </li>
              <li>
                <a href="tel:+96407733587355" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">+964 07733587355</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Daily: 11:00 AM - 11:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-display text-lg text-primary mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61586279907533"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 group"
              >
                <Facebook className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a
                href="https://www.instagram.com/westren.bite.iq/?__pwa=1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 group"
              >
                <Instagram className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-secondary hover:bg-primary transition-colors duration-300 group"
              >
                <Twitter className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} Western Bite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
