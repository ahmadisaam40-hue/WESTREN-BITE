import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-wood">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-title mb-4">About Western Bite</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Born in the West, serving the best
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl text-primary mb-6">Our Story</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Western Bite was born from a passion for authentic Western American cuisine. 
              We bring the bold, smoky flavors of the Wild West to Iraq, offering premium 
              steaks, gourmet burgers, and classic BBQ dishes made with the finest ingredients.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our chefs are dedicated to creating memorable dining experiences, whether 
              you're enjoying a meal at our restaurant or having it delivered to your door. 
              Every dish is prepared with care and seasoned with authentic Western spices.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-center text-primary mb-12">What We Stand For</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-display text-2xl text-primary">1</span>
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                We use only premium ingredients to ensure every bite is exceptional.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-display text-2xl text-primary">2</span>
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Authenticity</h3>
              <p className="text-sm text-muted-foreground">
                True Western flavors prepared with traditional techniques.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-display text-2xl text-primary">3</span>
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Customer Care</h3>
              <p className="text-sm text-muted-foreground">
                Your satisfaction is our top priority, always.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
