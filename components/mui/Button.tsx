import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { forwardRef } from "react";

export interface ButtonProps extends MuiButtonProps {
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "contained", color = "primary", ...props }, ref) => (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color as any}
      sx={{
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 500,
        borderRadius: "0.375rem",
        ...props.sx,
      }}
      {...props}
    />
  ),
);

Button.displayName = "Button";
