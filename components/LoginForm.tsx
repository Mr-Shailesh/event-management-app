"use client";

import { useState, type ChangeEvent } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Box, Typography, Stack } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { loginValidationSchema, LoginFormValues } from "@/utils/validation";
import { Button, Input, Card, CardContent, CardHeader } from "@/components/mui";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validateOnChange: false,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await login(values.email, values.password);
        toast.success("Welcome back!");
        router.replace("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    form.setFieldValue(name, event.target.value, false);

    if (form.errors[name as keyof LoginFormValues]) {
      form.setFieldError(name, "");
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "30rem",
        borderRadius: "20px",
        border: "1px solid #dbe2ec",
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(14px)",
      }}
    >
      <CardHeader sx={{ pb: 0.5 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, textAlign: "center", color: "#111827" }}
        >
          Sign In
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#667085", mt: 0.75 }}
        >
          Welcome back. Sign in to manage your events.
        </Typography>
      </CardHeader>
      <CardContent>
        <Stack component="form" onSubmit={form.handleSubmit} spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
            >
              Email
            </Typography>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.values.email}
              onChange={handleFieldChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
              error={!!(form.errors.email && form.touched.email)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: 50,
                },
              }}
            />
            {form.errors.email && form.touched.email && (
              <Typography
                variant="caption"
                sx={{ color: "error.main", display: "block", mt: 0.5 }}
              >
                {form.errors.email}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
            >
              Password
            </Typography>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              value={form.values.password}
              onChange={handleFieldChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
              error={!!(form.errors.password && form.touched.password)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: 50,
                },
              }}
            />
            {form.errors.password && form.touched.password && (
              <Typography
                variant="caption"
                sx={{ color: "error.main", display: "block", mt: 0.5 }}
              >
                {form.errors.password}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              minHeight: 50,
              borderRadius: "12px",
              bgcolor: "#1f1f1f",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: "#111111", boxShadow: "none" },
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#667085" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
