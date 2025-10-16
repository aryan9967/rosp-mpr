import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  SignUpButton,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import LanguageSwitch from "./LanguageSwitch";
import logo from "../assets/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const { isSignedIn } = useUser(); // Check if user is logged in

  const navItems = [
    { name: "Home", path: "/" },
    // { name: "Services-Nearby", path: "/hospital-locator" },
    { name: "Symptom-Checker", path: "/symptom-checker" },
    { name: "First-Aid Guide", path: "/first-aid-guide" },
    // { name: "Live-Assistance", path: "/videocall" },
    {name: "Medicines", path : '/medicines'}
  ];

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
      );

      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
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
          ".menu-item",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 pr-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          {/* <div ref={logoRef} className="h-8 w-8 rounded-full bg-primary" /> */}
          {/* <span className="text-xl font-bold">MediAid</span> */}
          <img src={logo} className="h-10" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-4">
          <LanguageSwitch />

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Authentication Buttons */}
          {!isSignedIn ? (
            <>
              <SignUpButton forceRedirectUrl="/profile">
                <Button size="sm" className="nav-item ml-4">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton afterSignInUrl="/">
                <Button size="sm" variant="outline" className="nav-item">
                  Log In
                </Button>
              </SignInButton>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* <Link 
                  to="/profile" 
                  className={`nav-item px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/profile" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  Profile
                </Link> */}
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div ref={menuRef} className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`menu-item block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Authentication Buttons in Mobile Menu */}
            <div className="pt-2 menu-item">
              {!isSignedIn ? (
                <>
                  <SignUpButton forceRedirectUrl="/profile">
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </SignUpButton>
                  <SignInButton afterSignInUrl="/" >
                    <Button size="sm" variant="outline" className="w-full mt-2 ">
                      Log In
                    </Button>
                  </SignInButton>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/medicines"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === "/profile"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Medicines
                  </Link>
                  <div className="flex items-center justify-between px-3 py-2">
                    <UserButton afterSignOutUrl="/" />
                    <SignOutButton>
                      <Button size="sm" variant="outline">
                        Log Out
                      </Button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
