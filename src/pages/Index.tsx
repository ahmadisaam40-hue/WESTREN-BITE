import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Star, Utensils, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import MenuItemCard from '@/components/MenuItemCard';
import { useMenuStore } from '@/store/menuStore';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { items, categories } = useMenuStore();
  const featuresRef = useRef<HTMLDivElement>(null);
  const menuPreviewRef = useRef<HTMLDivElement>(null);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    if (trackOrderId.trim()) {
      // Remove # if present so it doesn't get treated as a URL hash
      const cleanId = trackOrderId.trim().replace(/^#/, '');
      navigate(`/track/${cleanId}`);
      setTrackDialogOpen(false);
      setTrackOrderId('');
    }
  };

  // Get 3 featured items
  const featuredItems = items.filter((item) => item.isAvailable).slice(0, 3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate features
      gsap.fromTo(
        '.feature-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animate menu preview
      gsap.fromTo(
        '.menu-preview-item',
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: menuPreviewRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Utensils,
      title: 'Authentic Western Cuisine',
      description: 'Experience the bold flavors of the Wild West with our carefully crafted dishes.',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'We use only the finest ingredients to ensure every bite is memorable.',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Hot and fresh meals delivered to your doorstep quickly.',
    },
    {
      icon: MapPin,
      title: 'Easy Ordering',
      description: 'Order online with precise location tracking for hassle-free delivery.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-16">Why Choose Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card card-western p-6 text-center fire-glow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section ref={menuPreviewRef} className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Featured Dishes</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our most popular Western delights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredItems.map((item) => (
              <div key={item.id} className="menu-preview-item">
                <MenuItemCard item={item} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/menu" className="btn-western inline-block">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-wood relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1)_0%,transparent_70%)]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Ready to Experience the West?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Order now and get your favorite Western dishes delivered hot and fresh to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/menu"
              className="btn-western inline-block"
            >
              Order Now
            </Link>

            <Dialog open={trackDialogOpen} onOpenChange={setTrackDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 h-12 px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Search className="w-5 h-5" />
                  Track Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Track Your Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Enter your order number"
                    value={trackOrderId}
                    onChange={(e) => setTrackOrderId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
                    className="h-12"
                  />
                  <Button onClick={handleTrackOrder} className="w-full btn-western">
                    Track Order
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
