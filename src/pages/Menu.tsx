import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/MenuItemCard';
import { useMenuStore } from '@/store/menuStore';
import { Flame, Sparkles } from 'lucide-react';

const Menu = () => {
  const { items, categories } = useMenuStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeCategory === 'all'
    ? items.filter((item) => item.isAvailable)
    : items.filter((item) => item.category === activeCategory && item.isAvailable);

  useEffect(() => {
    // Animate items when category changes
    gsap.fromTo(
      '.menu-item',
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }
    );
  }, [activeCategory]);

  useEffect(() => {
    // Header animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Floating flames animation
    gsap.to('.floating-flame', {
      y: -20,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section ref={headerRef} className="pt-28 pb-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-wood opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl floating-flame" />
          <div className="absolute top-10 right-1/4 w-40 h-40 bg-accent/20 rounded-full blur-3xl floating-flame" />
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-2xl floating-flame" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-primary animate-flame" />
            <h1 className="section-title">Our Menu</h1>
            <Flame className="w-8 h-8 text-accent animate-flame" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Explore our delicious Western-inspired dishes
            <Sparkles className="w-5 h-5 text-accent" />
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 py-4 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              data-active={activeCategory === 'all'}
              className="menu-category-btn flex-shrink-0 group relative overflow-hidden"
            >
              <span className="relative z-10">All</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 data-[active=true]:opacity-100 transition-opacity" />
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                data-active={activeCategory === category.id}
                className="menu-category-btn flex-shrink-0 group relative overflow-hidden"
              >
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section ref={menuRef} className="py-12 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Flame className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg font-display">
                No items available in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="menu-item">
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
