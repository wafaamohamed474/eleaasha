"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "@/assets/images/logo.png";
import { Button } from "../ui/button";
import { LangSwitch } from "../molecules/LangSwitch";
import { cn } from "@/lib/utils";
import { usePathname, Link } from "@/i18n/navigation";
import { AuthDialog } from "../ui/AuthDialog";
import { useGetFooterDataQuery } from "@/store/services/authApi";
import { useLocale } from "next-intl";

const Navbar = () => {
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState("home");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home");
      const aboutSection = document.getElementById("about");

      const scrollPosition = window.scrollY + 100;

      if (
        aboutSection &&
        scrollPosition >= aboutSection.offsetTop &&
        scrollPosition < aboutSection.offsetTop + aboutSection.offsetHeight
      ) {
        if (activeSection !== "about") {
          setActiveSection("about");
          window.history.replaceState(
            null,
            "",
            window.location.pathname + "#about",
          );
        }
      } else if (
        homeSection &&
        scrollPosition >= homeSection.offsetTop &&
        scrollPosition < homeSection.offsetTop + homeSection.offsetHeight
      ) {
        if (activeSection !== "home") {
          setActiveSection("home");
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        if (window.scrollY < 100 && activeSection !== "home") {
          setActiveSection("home");
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const { data } = useGetFooterDataQuery(locale);
  const navLinks = [
    { name: t("home"), href: "/", id: "home", isExternal: false },
    { name: t("about"), href: "/#about", id: "about", isExternal: false },
    {
      name: t("contact"),
      href: `https://wa.me/${data?.data?.support?.whatsapp.replace(/\+/g, "")}`,
      id: "contact",
      isExternal: true,
    },
  ];

  const isActive = (link: { href: string; id: string }) => {
    if (link.id === "contact") return false;
    if (activeSection === link.id) return true;
    return false;
  };

  const handleLinkClick = (id: string) => {
    if (id !== "contact") setActiveSection(id);
    toggleMenu();
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent transition-all duration-300 ">
      <div className="container-custom  w-full">
        <div className="py-1 md:py-2 flex items-center justify-between border-b border-(--border) w-full">
          {/* Right Side: Logo */}
          <div className="relative z-50">
            <Link href="/">
              <Image
                src={logo}
                alt="El-Eaasha Logo"
                className="w-20 h-20 object-contain"
              />
            </Link>
          </div>

          {/* Center: Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8  ">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className={cn(
                  "text-lg font-medium transition-colors p-0",
                  isActive(link)
                    ? "text-(--primary)"
                    : "text-white hover:text-(--primary)",
                )}
                onClick={() => {
                  if (!link.isExternal) setActiveSection(link.id);
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Left Side: Actions (Login Button + Lang Switcher) - Desktop */}
          <div className="hidden lg:flex items-center space-x-4  ">
            {/* Language Switcher Placeholder - Assuming standard locale switching logic is needed later or exists */}

            <AuthDialog
              trigger={<Button variant="primary">{t("login")}</Button>}
            />

            <div className="">
              <LangSwitch />
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="lg:hidden  text-(--primary) focus:outline-none z-50"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out lg:hidden z-40 ${
          isOpen ? "translate-y-0" : "-translate-y-full  "
        }`}
      >
        <div className="flex flex-col items-center pt-24 pb-10 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => handleLinkClick(link.id)}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "text-lg font-medium transition-colors",
                isActive(link)
                  ? "text-(--primary)"
                  : "text-(--secondary) hover:text-(--primary)",
              )}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex flex-col items-center space-y-4 w-full px-8">
            <div className="flex items-center space-x-4">
              <AuthDialog
                trigger={
                  <Button variant="primary" onClick={toggleMenu}>
                    {t("login")}
                  </Button>
                }
              />
              <AuthDialog
                trigger={
                  <Button variant="primary" onClick={toggleMenu}>
                    {t("register")}
                  </Button>
                }
                initialStep="REGISTER"
              />
            </div>

            <div className="">
              <LangSwitch />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
