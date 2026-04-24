import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Box,
  BoxProps,
  CardProps as MuiCardProps,
  CardContentProps,
} from "@mui/material";
import { forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, MuiCardProps>(
  ({ className, ...props }, ref) => (
    <MuiCard
      ref={ref}
      sx={{
        borderRadius: "0.875rem",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        ...props.sx,
      }}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      sx={{
        padding: "1.5rem",
        paddingBottom: "1rem",
        ...sx,
      }}
      className={className}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => (
    <MuiCardContent
      ref={ref}
      sx={{
        padding: "1.5rem",
        "&:last-child": {
          paddingBottom: "1.5rem",
        },
        ...props.sx,
      }}
      {...props}
    />
  ),
);

CardContent.displayName = "CardContent";
