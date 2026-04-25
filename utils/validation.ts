import dayjs from "dayjs";
import * as Yup from "yup";
import { EventFormat, Category } from "@/types";

export interface EventFormValues {
  title: string;
  description: string;
  eventType: EventFormat;
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: Category;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const eventValidationSchema = (eventType: EventFormat) =>
  Yup.object().shape({
    title: Yup.string()
      .required("Event title is required")
      .min(3, "Event title must be at least 3 characters")
      .max(100, "Event title must not exceed 100 characters"),

    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters"),

    eventType: Yup.string().required("Event type is required"),

    category: Yup.string().required("Category is required"),

    startDateTime: Yup.string()
      .required("Start date and time is required")
      .test("valid-date", "Invalid date format", (value) => {
        if (!value) return false;
        return dayjs(value).isValid();
      }),

    endDateTime: Yup.string()
      .required("End date and time is required")
      .test("valid-date", "Invalid date format", (value) => {
        if (!value) return false;
        return dayjs(value).isValid();
      })
      .test(
        "end-after-start",
        "End date must be after start date",
        function (value) {
          const { startDateTime } = this.parent;
          if (!value || !startDateTime) return true;
          return dayjs(value).isAfter(dayjs(startDateTime));
        },
      ),

    location:
      eventType === "In-Person"
        ? Yup.string()
            .required("Location is required for in-person events")
            .min(3, "Location must be at least 3 characters")
            .max(200, "Location must not exceed 200 characters")
        : Yup.string()
            .optional()
            .max(200, "Location must not exceed 200 characters"),

    eventLink:
      eventType === "Online"
        ? Yup.string()
            .required("Event link is required for online events")
            .url("Event link must be a valid URL")
        : Yup.string().optional().url("Event link must be a valid URL"),
  });

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
