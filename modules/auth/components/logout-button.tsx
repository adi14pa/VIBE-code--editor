"use client";

import React from "react";
import { LogoutButtonProps } from "../types";
import { logout } from "../actions/logout";

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onLogout = async () => {
    await logout();
  };

  return (
    <span className="cursor-pointer" onClick={onLogout}>
      {children}
    </span>
  );
};

export default LogoutButton;
