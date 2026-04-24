import { Chip, ChipProps } from "@mui/material";
import { forwardRef } from "react";

export const Badge = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant = "filled", ...props }, ref) => (
    <Chip
      ref={ref}
      variant={variant as "filled" | "outlined"}
      size="small"
      sx={{
        borderRadius: "0.375rem",
        fontWeight: 500,
        ...props.sx,
      }}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";
