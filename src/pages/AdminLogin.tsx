import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/store/adminStore';
import { useTranslation } from '@/store/languageStore';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { authenticate, isAuthenticated } = useAdminStore();
  const { t, language } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin-panel');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.lock-icon',
      { rotateY: 0 },
      { rotateY: 360, duration: 1, delay: 0.3, ease: 'power2.inOut' }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticate(username, password)) {
      gsap.to(formRef.current, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => navigate('/admin-panel'),
      });
    } else {
      setError(t('admin.invalidCredentials'));
      gsap.to(formRef.current, {
        keyframes: [
          { x: -10 },
          { x: 10 },
          { x: -10 },
          { x: 10 },
          { x: 0 },
        ],
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Login Form */}
      <div ref={formRef} className="w-full max-w-sm relative">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative p-8 text-center border-b border-border bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
            <div className="lock-icon w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl text-gradient">{t('admin.login')}</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('admin.username')}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder={t('admin.usernamePlaceholder')}
                className="h-12 bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t('admin.password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder={t('admin.passwordPlaceholder')}
                  className="h-12 bg-secondary/50 border-border focus:border-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center font-display animate-fade-in">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full btn-western h-12">
              {t('admin.unlock')}
            </Button>

            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('admin.goHome')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;