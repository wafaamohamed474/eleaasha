import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";  
import { useLocale } from "next-intl";

type BaseProps = {
  icon: React.ReactNode;
  label: string;
  className?: string;
  showArrow?: boolean;
  trailing?: React.ReactNode;
  color?: string;
};

type LinkProps = BaseProps & {
  href: string;
  onClick?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  onClick: () => void;
   
};

type SettingMenuItemProps = LinkProps | ButtonProps;

export function SettingMenuItem({
  icon,
  label,
  href,
  onClick,
  className,
  showArrow = true,
  trailing,
  color,
}: SettingMenuItemProps) {
  const locale = useLocale();
  const langKey = locale === 'ar' ? 'English' : 'العربية';
  const renderTrailing = () => {
    if (trailing) return trailing;
    if (!showArrow) return null;
    return locale === 'ar' ? 
      <ChevronLeft className="h-5 w-5 text-gray-400" /> : 
      <ChevronRight className="h-5 w-5 text-gray-400" />;
  };

  const Content = (
    <div
      className={cn(
        "flex items-center justify-between w-full rounded-2xl border border-gray-100 bg-white px-4 py-5",
        "hover:bg-gray-50 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className={`text-(--item-icon) w-5 ${color}`}>{icon}</span>
        <span className={`text-sm font-semibold text-black ${color}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
      {trailing && <span>{langKey}</span>}
      {renderTrailing()}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {Content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
    >
      {Content}
    </button>
  );
}
