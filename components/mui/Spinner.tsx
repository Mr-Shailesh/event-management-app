import { CircularProgress, CircularProgressProps } from "@mui/material";
import { forwardRef } from "react";

export const Spinner = forwardRef<HTMLDivElement, CircularProgressProps>(
  (props, ref) => <CircularProgress ref={ref} size={40} {...props} />,
);

Spinner.displayName = "Spinner";
