import React, { forwardRef } from "react";
import { Button } from "../ui/button";
import { FaBell } from "react-icons/fa";

interface NotificationsBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count: number;
}

const NotificationsBtn = forwardRef<HTMLButtonElement, NotificationsBtnProps>(
  ({ count, ...props }, ref) => {
    return (
      <Button
        variant="default"
        asChild
        className="bg-(--secondary-foreground) rounded-full "
        {...props}
        ref={ref}
      >
        <div className=" flex items-center justify-between px-3! py-2!">
          <FaBell className="h-5 w-5 text-(--primary)" />
          {count > 0 && (
            <span className="rounded-full bg-[#F18B241A] text-(--primary) text-xs w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
      </Button>
    );
  }
);

NotificationsBtn.displayName = "NotificationsBtn";

export default NotificationsBtn;
