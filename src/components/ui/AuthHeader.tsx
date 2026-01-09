import Image from "next/image";
import headerLogo from "@/assets/images/AboutImg.png";

interface AuthHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <div className=" w-full flex justify-start">
<div  >
        <Image
          src={headerLogo} 
          alt="Logo"
          width={50}
          height={50}
          className="object-contain"
        />
      </div>
      </div>
      
      <h1 className="text-sm md:text-xl font-bold text-(--secondary) mb-2">{title}</h1>
      {subtitle && <p className="text-(--main-text) text-xs md:px-20">{subtitle}</p>}
    </div>
  );
};
