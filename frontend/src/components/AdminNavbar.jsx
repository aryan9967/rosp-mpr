import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Menu, X, ShieldAlert } from 'lucide-react';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Emergency Cases', path: '/admin/emergency' },
    { name: 'Video Calls', path: '/admin/videocall' },
  ];

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
      );

      gsap.fromTo(
        '.admin-nav-item',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }, navbarRef);

    return () => ctx.revert();
  }, []);

  // Handle mobile menu animation
  useEffect(() => {
    if (!menuRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.fromTo(
          '.admin-menu-item',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
        );
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header ref={navbarRef} className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/admin" className="flex items-center space-x-2">
          <ShieldAlert ref={logoRef} className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Admin Panel</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button size="sm" className="admin-nav-item ml-4">Log Out</Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div ref={menuRef} className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-menu-item block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 admin-menu-item">
              <Button className="w-full">Log Out</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
