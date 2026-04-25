import { TextField, type TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

export type InputProps = TextFieldProps & {
  variant?: "outlined" | "filled" | "standard";
};

export const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ className, sx, ...props }, ref) => (
    <TextField
      ref={ref}
      variant="outlined"
      fullWidth
      size="small"
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.375rem",
            backgroundColor: "#fff",
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  ),
);

Input.displayName = "Input";
