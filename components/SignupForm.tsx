"use client";

import { useState, type ChangeEvent } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Box, Typography, Stack } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { signupValidationSchema, SignupFormValues } from "@/utils/validation";
import { Button, Input, Card, CardContent, CardHeader } from "@/components/mui";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useFormik<SignupFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: false,
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await signup(values.username, values.email, values.password);
        toast.success("Account created successfully!");
        router.replace("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    form.setFieldValue(name, event.target.value, false);

    if (form.errors[name as keyof SignupFormValues]) {
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
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(14px)",
      }}
    >
      <CardHeader sx={{ pb: 0.75 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, textAlign: "center", color: "#111827" }}
        >
          Create Account
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#667085", mt: 0.75 }}
        >
          Join us to manage your events
        </Typography>
      </CardHeader>
      <CardContent>
        <Stack component="form" onSubmit={form.handleSubmit} spacing={2.5}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
            >
              Username
            </Typography>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="John Doe"
              value={form.values.username}
              onChange={handleFieldChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
              error={!!(form.errors.username && form.touched.username)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: 50,
                },
              }}
            />
            {form.errors.username && form.touched.username && (
              <Typography
                variant="caption"
                sx={{ color: "error.main", display: "block", mt: 0.5 }}
              >
                {form.errors.username}
              </Typography>
            )}
          </Box>

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
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
            >
              At least 6 chars, 1 uppercase, 1 lowercase, 1 number
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
            >
              Confirm Password
            </Typography>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.values.confirmPassword}
              onChange={handleFieldChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
              error={
                !!(form.errors.confirmPassword && form.touched.confirmPassword)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: 50,
                },
              }}
            />
            {form.errors.confirmPassword && form.touched.confirmPassword && (
              <Typography
                variant="caption"
                sx={{ color: "error.main", display: "block", mt: 0.5 }}
              >
                {form.errors.confirmPassword}
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#667085" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
