"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import { useFormik } from "formik";
import { Box, Typography, Stack } from "@mui/material";
import { Event, EventFormat, Category } from "@/types";
import { eventValidationSchema, EventFormValues } from "@/utils/validation";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  Spinner,
} from "@/components/mui";

const CATEGORIES: Category[] = [
  "business",
  "education",
  "entertainment",
  "sports",
  "technology",
  "health",
  "other",
];

const EVENT_FORMATS: EventFormat[] = ["Online", "In-Person"];

interface EventFormProps {
  initialEvent?: Event;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  cardTitle?: string;
  cardDescription?: string;
}

export function EventForm({
  initialEvent,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Create Event",
  cardTitle,
  cardDescription,
}: EventFormProps) {
  const [eventType, setEventType] = useState<EventFormat>(
    (initialEvent?.eventType ?? "Online") as EventFormat,
  );

  const initialValues: EventFormValues = useMemo(
    () => ({
      title: initialEvent?.title ?? "",
      description: initialEvent?.description ?? "",
      eventType: initialEvent?.eventType ?? "Online",
      location: initialEvent?.location ?? "",
      eventLink: initialEvent?.eventLink ?? "",
      startDateTime: initialEvent?.startDateTime ?? "",
      endDateTime: initialEvent?.endDateTime ?? "",
      category: initialEvent?.category ?? "business",
    }),
    [initialEvent],
  );

  const validationSchema = useMemo(
    () => eventValidationSchema(eventType),
    [eventType],
  );

  const form = useFormik<EventFormValues>({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema,
    onSubmit,
  });

  const clearFieldError = (name: keyof EventFormValues) => {
    if (form.errors[name]) {
      form.setFieldError(name, "");
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    form.setFieldValue(name, value, false);
    clearFieldError(name as keyof EventFormValues);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    form.setFieldValue(name, value, false);
    clearFieldError(name as keyof EventFormValues);
  };

  const handleEventTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newEventType = event.target.value as EventFormat;
    setEventType(newEventType);
    handleSelectChange(event);
  };

  const resolvedCardTitle = cardTitle ?? "Event Details";
  const resolvedCardDescription =
    cardDescription ??
    "Add the essential details and publish when you are ready.";

  return (
    <Box sx={{ maxWidth: "48rem", mx: "auto" }}>
      <Card
        sx={{
          border: "1px solid #d8dee8",
          borderRadius: "22px",
          overflow: "hidden",
          background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
        }}
      >
        <CardHeader sx={{ pb: 0.5 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, color: "#172033" }}
          >
            {resolvedCardTitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "#667085" }}>
            {resolvedCardDescription}
          </Typography>
        </CardHeader>
        <CardContent>
          <Box
            component="form"
            onSubmit={form.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
              >
                Event Title *
              </Typography>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter event title"
                value={form.values.title}
                onChange={handleInputChange}
                onBlur={form.handleBlur}
                disabled={isLoading}
                error={!!(form.errors.title && form.touched.title)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    minHeight: 50,
                  },
                }}
              />
              {form.errors.title && form.touched.title && (
                <Typography
                  variant="caption"
                  sx={{ color: "error.main", display: "block", mt: 0.5 }}
                >
                  {form.errors.title}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
              >
                Description *
              </Typography>
              <Input
                id="description"
                name="description"
                placeholder="Enter event description"
                value={form.values.description}
                onChange={handleInputChange}
                onBlur={form.handleBlur}
                disabled={isLoading}
                multiline
                rows={4}
                error={!!(form.errors.description && form.touched.description)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    alignItems: "flex-start",
                  },
                }}
              />
              {form.errors.description && form.touched.description && (
                <Typography
                  variant="caption"
                  sx={{ color: "error.main", display: "block", mt: 0.5 }}
                >
                  {form.errors.description}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                >
                  Event Type *
                </Typography>
                <Box
                  component="select"
                  name="eventType"
                  value={form.values.eventType}
                  onChange={handleEventTypeChange}
                  onBlur={form.handleBlur}
                  disabled={isLoading}
                  sx={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    minHeight: 50,
                    border:
                      form.errors.eventType && form.touched.eventType
                        ? "1px solid #d32f2f"
                        : "1px solid #d0d5dd",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    color: "#172033",
                    backgroundColor: "#fff",
                    "&:focus": { outline: "none", borderColor: "#1976d2" },
                  }}
                >
                  {EVENT_FORMATS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </Box>
                {form.errors.eventType && form.touched.eventType && (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", display: "block", mt: 0.5 }}
                  >
                    {form.errors.eventType}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                >
                  Category *
                </Typography>
                <Box
                  component="select"
                  name="category"
                  value={form.values.category}
                  onChange={handleSelectChange}
                  onBlur={form.handleBlur}
                  disabled={isLoading}
                  sx={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    minHeight: 50,
                    border:
                      form.errors.category && form.touched.category
                        ? "1px solid #d32f2f"
                        : "1px solid #d0d5dd",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    color: "#172033",
                    backgroundColor: "#fff",
                    "&:focus": { outline: "none", borderColor: "#1976d2" },
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </Box>
                {form.errors.category && form.touched.category && (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", display: "block", mt: 0.5 }}
                  >
                    {form.errors.category}
                  </Typography>
                )}
              </Box>
            </Box>

            {eventType === "Online" ? (
              <>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                  >
                    Event Link *
                  </Typography>
                  <Input
                    id="eventLink"
                    name="eventLink"
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    value={form.values.eventLink}
                    onChange={handleInputChange}
                    onBlur={form.handleBlur}
                    disabled={isLoading}
                    error={!!(form.errors.eventLink && form.touched.eventLink)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        minHeight: 50,
                      },
                    }}
                  />
                  {form.errors.eventLink && form.touched.eventLink && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", display: "block", mt: 0.5 }}
                    >
                      {form.errors.eventLink}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                  >
                    Location (Optional)
                  </Typography>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Physical location if applicable"
                    value={form.values.location}
                    onChange={handleInputChange}
                    onBlur={form.handleBlur}
                    disabled={isLoading}
                    error={!!(form.errors.location && form.touched.location)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        minHeight: 50,
                      },
                    }}
                  />
                  {form.errors.location && form.touched.location && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", display: "block", mt: 0.5 }}
                    >
                      {form.errors.location}
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                  >
                    Location *
                  </Typography>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Enter event location"
                    value={form.values.location}
                    onChange={handleInputChange}
                    onBlur={form.handleBlur}
                    disabled={isLoading}
                    error={!!(form.errors.location && form.touched.location)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        minHeight: 50,
                      },
                    }}
                  />
                  {form.errors.location && form.touched.location && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", display: "block", mt: 0.5 }}
                    >
                      {form.errors.location}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                  >
                    Event Link (Optional)
                  </Typography>
                  <Input
                    id="eventLink"
                    name="eventLink"
                    type="url"
                    placeholder="Video link for hybrid events"
                    value={form.values.eventLink}
                    onChange={handleInputChange}
                    onBlur={form.handleBlur}
                    disabled={isLoading}
                    error={!!(form.errors.eventLink && form.touched.eventLink)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        minHeight: 50,
                      },
                    }}
                  />
                  {form.errors.eventLink && form.touched.eventLink && (
                    <Typography
                      variant="caption"
                      sx={{ color: "error.main", display: "block", mt: 0.5 }}
                    >
                      {form.errors.eventLink}
                    </Typography>
                  )}
                </Box>
              </>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                >
                  Start Date & Time *
                </Typography>
                <Input
                  id="startDateTime"
                  name="startDateTime"
                  type="datetime-local"
                  value={form.values.startDateTime}
                  onChange={handleInputChange}
                  onBlur={form.handleBlur}
                  disabled={isLoading}
                  error={
                    !!(form.errors.startDateTime && form.touched.startDateTime)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      minHeight: 50,
                    },
                  }}
                />
                {form.errors.startDateTime && form.touched.startDateTime && (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", display: "block", mt: 0.5 }}
                  >
                    {form.errors.startDateTime}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: "#334155" }}
                >
                  End Date & Time *
                </Typography>
                <Input
                  id="endDateTime"
                  name="endDateTime"
                  type="datetime-local"
                  value={form.values.endDateTime}
                  onChange={handleInputChange}
                  onBlur={form.handleBlur}
                  disabled={isLoading}
                  error={
                    !!(form.errors.endDateTime && form.touched.endDateTime)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      minHeight: 50,
                    },
                  }}
                />
                {form.errors.endDateTime && form.touched.endDateTime && (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", display: "block", mt: 0.5 }}
                  >
                    {form.errors.endDateTime}
                  </Typography>
                )}
              </Box>
            </Box>

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <Spinner /> : undefined}
                sx={{
                  minHeight: 50,
                  borderRadius: "12px",
                  bgcolor: "#1f1f1f",
                  fontWeight: 700,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#111111", boxShadow: "none" },
                }}
              >
                {isLoading ? "Saving..." : submitButtonText}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={onCancel}
                  disabled={isLoading}
                  sx={{ minHeight: 50, borderRadius: "12px", fontWeight: 700 }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
