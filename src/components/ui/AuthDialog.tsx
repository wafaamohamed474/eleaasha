"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthSteps } from "@/features/auth/AuthSteps";
import { useDispatch, useSelector } from "react-redux";
import { AuthStep, resetAuth, setIsDialogOpen } from "@/store/services/authSlice";
import { RootState } from "@/store/Store";

interface AuthDialogProps {
  trigger?: React.ReactNode;
  initialStep?: AuthStep;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ 
  trigger, 
  initialStep = "LOGIN",
  open: controlledOpen,
  onOpenChange: setControlledOpen
}) => {
  const dispatch = useDispatch();
  const reduxOpen = useSelector((state: RootState) => state.auth.isDialogOpen);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // If a trigger is used, we use local/controlled state. 
  // If no trigger, we might be watching Redux.
  const isGlobal = !trigger && controlledOpen === undefined;
  const open = isGlobal ? reduxOpen : (controlledOpen !== undefined ? controlledOpen : uncontrolledOpen);
  
  const setOpen = (newOpen: boolean) => {
    if (!newOpen) {
      dispatch(resetAuth());
      if (isGlobal) dispatch(setIsDialogOpen(false));
    }
    
    if (setControlledOpen !== undefined) {
      setControlledOpen(newOpen);
    } else if (!isGlobal) {
      setUncontrolledOpen(newOpen);
    } else {
        dispatch(setIsDialogOpen(newOpen));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[450px] md:max-w-lg lg:max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in or create an account to manage your catering services.
        </DialogDescription>
        <AuthSteps 
          initialStep={initialStep} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
