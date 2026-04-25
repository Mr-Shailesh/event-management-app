"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button as MuiButton,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Avatar, Button } from "@/components/mui";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventsContext";
import { useFilters } from "@/context/FilterContext";
import { getInitials } from "@/utils/auth";
import { clearLocalStorage } from "@/utils/storage";

export function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { resetEvents } = useEvents();
  const { resetFilters } = useFilters();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCleanupOpen, setIsCleanupOpen] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const open = Boolean(anchorEl);
  const displayName = user?.username || "User";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    router.replace("/login");
  };

  const handleCleanupOpen = () => {
    handleMenuClose();
    setIsCleanupOpen(true);
  };

  const handleCleanupClose = () => {
    if (isCleaningUp) return;
    setIsCleanupOpen(false);
  };

  const handleCleanupConfirm = async () => {
    setIsCleaningUp(true);

    try {
      logout();
      resetEvents();
      resetFilters();
      clearLocalStorage();
      setIsCleanupOpen(false);
      router.replace("/login");
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid #dde3ec",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
          minHeight: 66,
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#2f5bea",
              fontSize: "1.45rem",
              letterSpacing: "-0.03em",
            }}
          >
            Event Manager
          </Typography>
        </Link>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 3 },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#283247",
                  "&:hover": { color: "#000" },
                }}
              >
                Events
              </Typography>
            </Link>
            <Link href="/events/create" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#283247",
                  "&:hover": { color: "#000" },
                }}
              >
                Create Event
              </Typography>
            </Link>
          </Box>

          <Box>
            <MuiButton
              onClick={handleMenuOpen}
              sx={{
                minWidth: "auto",
                px: 0.5,
                textTransform: "none",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: "0.8rem",
                  bgcolor: "#e6efff",
                  color: "#2f5bea",
                  fontWeight: 700,
                }}
              >
                {user ? getInitials(user.username) : "US"}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", sm: "inline" },
                  fontWeight: 500,
                  color: "#111827",
                }}
              >
                {displayName}
              </Typography>
            </MuiButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {displayName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                component={Link}
                href="/dashboard"
                onClick={handleMenuClose}
              >
                Dashboard
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCleanupOpen}>Clean Up</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                Sign out
              </MenuItem>
            </Menu>

            <Dialog
              open={isCleanupOpen}
              onClose={handleCleanupClose}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle sx={{ fontWeight: 600 }}>Clear All Data</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to clear all data? This will remove all
                  users, events, and session data from local storage.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCleanupClose}
                  disabled={isCleaningUp}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  onClick={handleCleanupConfirm}
                  disabled={isCleaningUp}
                >
                  {isCleaningUp ? "Clearing..." : "Yes"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
