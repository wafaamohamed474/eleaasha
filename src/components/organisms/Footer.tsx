import { useLocale, useTranslations } from "next-intl";
import logo from "@/assets/images/logo.png";
import googleplay from "@/assets/images/googleplay.png";
import applestore from "@/assets/images/AppleStore.png";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useGetFooterDataQuery } from "@/store/services/authApi";
import { useDispatch } from "react-redux";
import { setIsDialogOpen } from "@/store/services/authSlice";
import { checkAuthStatus } from "@/lib/auth/authClient";

const Footer = () => {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: footerResponse } = useGetFooterDataQuery(locale);
  const footerData = footerResponse?.data;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebookF className="md:text-2xl text-lg" />;
      case "instagram":
        return <FaInstagram className="md:text-2xl text-lg" />;
      case "linkedin":
        return <FaLinkedinIn className="md:text-2xl text-lg" />;
      case "twitter":
        return <FaXTwitter className="md:text-2xl text-lg" />;
      case "tiktok":
        return <FaTiktok className="md:text-2xl text-lg" />;
      case "youtube":
        return <FaYoutube className="md:text-2xl text-lg" />;
      default:
        return null;
    }
  };

  const handleAuthLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    if (checkAuthStatus()) {
      router.push(href as any);
    } else {
      dispatch(setIsDialogOpen(true));
    }
  };

  // Filter out app store links if they appear in social_links array
  const socialLinks = footerData?.social_links.filter(
    (link) =>
      !["google-play", "app-store"].includes(link.platform.toLowerCase())
  );

  return (
    <footer className="bg-(--secondary) text-white sec-p">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 xl:gap-5 text-center lg:text-start">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex flex-col items-center space-y-4">
              <Link href="/">
                <Image
                  src={logo}
                  alt="El-Eaasha Logo"
                  className="w-25 md:w-35 md:h-35 lg:h-50 lg:w-50 h-25 object-contain"
                />
              </Link>
              <p className="text-[10px] md:text-xs md:text-sm text-white">
                {t("about")}
              </p>
              <div className="flex space-x-2 md:space-x-4">
                {socialLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-(--primary) transition-colors"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Important Links */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h3 className="text-xs lg:text-lg font-bold border-b-2 border-primary/50 pb-2 inline-block">
              {t("importantLinks")}
            </h3>
            <ul className="space-y-2 md:space-y-5 text-[10px] md:text-xs lg:text-sm text-white">
              <li>
                <a
                  href={`/${locale}/dashboard`}
                  onClick={(e) => handleAuthLink(e, "/dashboard")}
                  className="hover:text-(--primary) transition-colors"
                >
                  {t("dashboard")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/dashboard/orders`}
                  onClick={(e) => handleAuthLink(e, "/dashboard/orders")}
                  className="hover:text-(--primary) transition-colors"
                >
                  {t("orders")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/dashboard/profile`}
                  onClick={(e) => handleAuthLink(e, "/dashboard/profile")}
                  className="hover:text-(--primary) transition-colors"
                >
                  {t("profile")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/dashboard/company`}
                  onClick={(e) => handleAuthLink(e, "/dashboard/company")}
                  className="hover:text-(--primary) transition-colors"
                >
                  {t("company")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h3 className="text-xs lg:text-lg font-bold border-b-2 border-primary/50 pb-2 inline-block">
              {t("customerService")}
            </h3>
            <ul className="space-y-2 md:space-y-5 text-[10px] md:text-xs lg:text-sm text-white">
              {footerData?.support.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${footerData.support.whatsapp.replace(
                      /\+/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-(--primary) transition-colors"
                  >
                    {t("contactWhatsapp")}
                  </a>
                </li>
              )}
              {footerData?.support.email && (
                <li>
                  <a
                    href={`mailto:${footerData.support.email}`}
                    className="hover:text-(--primary) transition-colors"
                  >
                    {footerData.support.email}
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-(--primary) transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-(--primary) transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: App Download */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h3 className="text-xs lg:text-lg font-bold border-b-2 border-primary/50 pb-2 inline-block">
              {t("downloadApp")}
            </h3>
            <p className="text-[10px] md:text-xs lg:text-sm text-white">
              {t("downloadDesc")}
            </p>
            <div className="flex flex-row gap-2 md:w-auto">
              {footerData?.app_links.app_store && (
                <a
                  href={footerData.app_links.app_store}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={applestore}
                    alt="App Store"
                    className="h-4 md:h-10 w-15 md:w-30"
                    objectFit="contain"
                  />
                </a>
              )}
              {footerData?.app_links.google_play && (
                <a
                  href={footerData.app_links.google_play}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={googleplay}
                    alt="Google Play"
                    className="h-4 md:h-10 w-15 md:w-30"
                    objectFit="contain"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
