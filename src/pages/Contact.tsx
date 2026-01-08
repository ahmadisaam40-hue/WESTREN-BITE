import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-wood">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-title mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="card-western p-6 text-center fire-glow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Address</h3>
              <p className="text-sm text-muted-foreground">
                Baghdad, Iraq
              </p>
            </div>

            <div className="card-western p-6 text-center fire-glow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Phone</h3>
              <p className="text-sm text-muted-foreground">
                <a href="tel:+96407733587355" className="hover:text-primary transition-colors">
                  +964 07733587355
                </a>
              </p>
            </div>

            <div className="card-western p-6 text-center fire-glow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">
                info@westernbite.iq
              </p>
            </div>

            <div className="card-western p-6 text-center fire-glow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Hours</h3>
              <p className="text-sm text-muted-foreground">
                Daily: 11 AM - 11 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
