import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  FormControlProps,
  SelectProps as MuiSelectProps,
} from "@mui/material";
import { forwardRef, ReactNode } from "react";

export interface SelectProps extends Omit<MuiSelectProps, "children"> {
  children?: ReactNode;
  options?: Array<{ label: string; value: string }>;
}

export const Select = forwardRef<any, SelectProps>(
  ({ options, children, ...props }, ref) => (
    <FormControl fullWidth size="small">
      <MuiSelect ref={ref} {...props}>
        {children ||
          options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
      </MuiSelect>
    </FormControl>
  ),
);

Select.displayName = "Select";

export const SelectItem = forwardRef<HTMLLIElement, any>(
  ({ children, value, ...props }, ref) => (
    <MenuItem ref={ref} value={value} {...props}>
      {children}
    </MenuItem>
  ),
);

SelectItem.displayName = "SelectItem";
