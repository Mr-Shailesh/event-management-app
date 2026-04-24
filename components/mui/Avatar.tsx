import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from "@mui/material";
import { forwardRef } from "react";

export interface AvatarProps extends MuiAvatarProps {}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => (
  <MuiAvatar
    ref={ref}
    sx={{
      width: 40,
      height: 40,
      fontSize: "0.875rem",
      fontWeight: 600,
      ...props.sx,
    }}
    {...props}
  />
));

Avatar.displayName = "Avatar";
