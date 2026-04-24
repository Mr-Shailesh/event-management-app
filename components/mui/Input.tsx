import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

export interface InputProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined" | "filled" | "standard";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <TextField
      ref={ref}
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.375rem",
          backgroundColor: "#fff",
        },
      }}
      {...props}
    />
  ),
);

Input.displayName = "Input";
