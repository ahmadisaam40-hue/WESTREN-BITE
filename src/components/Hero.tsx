import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import logo from '@/assets/logo.png';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2 }
      )
        .fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        );

      // Floating animation for logo
      gsap.to(logoRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-western-wood-dark via-background to-background" />
      
      {/* Animated fire particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-flame"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <img
          ref={logoRef}
          src={logo}
          alt="Western Bite"
          className="w-64 md:w-80 lg:w-96 mx-auto mb-8 drop-shadow-2xl"
        />
        
        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-6xl lg:text-7xl text-gradient mb-6"
        >
          Born in the West
        </h1>
        
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Experience authentic Western flavors in the heart of Iraq. 
          Sizzling steaks, gourmet burgers, and more await you.
        </p>
        
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/menu" className="btn-western">
            View Our Menu
          </Link>
          <Link
            to="/cart"
            className="px-8 py-4 font-display text-lg border-2 border-primary text-primary rounded-lg
                       transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Order Now
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
