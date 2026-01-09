import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
  isSettingsItem
}: {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
  isSettingsItem?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={label}
        className={cn(
          "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item h-10",
          active
            ? `bg-transparent! group-data-[state=expanded]:bg-(--item-hover)! text-(--secondary)! ${isSettingsItem ? "group-data-[state=expanded]:bg-(--settings-hover)! text-(--primary)!" : ""}`
            : `text-(--item-text) hover:text-(--secondary) group-data-[state=expanded]:hover:bg-(--item-hover) hover:bg-transparent   ${isSettingsItem ? "hover:text-(--primary) group-data-[state=expanded]:hover:bg-(--settings-hover)" : ""}`
        )}
      >
        <Link href={href}>
          <Icon
            className={cn(
              "h-5 w-5 transition-all duration-200 ",
              active
                ? `${isSettingsItem ? "text-(--primary)" : "text-(--secondary)"}`
                : `${isSettingsItem ? "group-hover/item:text-(--primary)" : "group-hover/item:text-(--secondary)"}`,
              "group-hover/item:scale-110"
            )}
          />
          <span className="truncate font-semibold text-xs group-data-[state=collapsed]:hidden">
            {label}
          </span>

          {active && (
            <div className={`absolute start-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-e-full ${isSettingsItem ? "bg-(--primary)" : "bg-(--secondary)"}`} />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
