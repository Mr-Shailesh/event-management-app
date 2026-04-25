"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import {
  formatEventDate,
  formatEventDateRange,
  formatEventTime,
  getEventStatus,
  canEditEvent,
  canDeleteEvent,
  getEditDeleteReason,
} from "@/utils/events";
import { Box, Typography } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Spinner,
} from "@/components/mui";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

const eventTypeColors: Record<string, { bg: string; color: string }> = {
  Online: { bg: "#e8f1ff", color: "#2563eb" },
  "In-Person": { bg: "#e7f8eb", color: "#1f7a44" },
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  business: { bg: "#f1e7ff", color: "#7c3aed" },
  education: { bg: "#e8edff", color: "#375dfb" },
  entertainment: { bg: "#ffe8f3", color: "#db2777" },
  sports: { bg: "#fff1e6", color: "#ea580c" },
  technology: { bg: "#e5fbff", color: "#0891b2" },
  health: { bg: "#e9fbef", color: "#15803d" },
  other: { bg: "#f3f4f6", color: "#4b5563" },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Upcoming: { bg: "#edf3ff", color: "#375dfb" },
  Ongoing: { bg: "#ebfaef", color: "#16a34a" },
  Completed: { bg: "#f3f4f6", color: "#4b5563" },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { getEventById, deleteEvent } = useEvents();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const foundEvent = getEventById(eventId);
    if (!foundEvent) {
      setIsNotFound(true);
      return;
    }
    setEvent(foundEvent);
  }, [eventId, getEventById]);

  if (!event && !isNotFound) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Spinner className="h-8 w-8" />
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Loading event details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isNotFound) {
    return (
      <Card
        sx={{
          maxWidth: "42rem",
          mx: "auto",
          my: { xs: 4, md: 8 },
          p: { xs: 3, md: 4 },
          textAlign: "center",
          border: "1px solid #d8dee8",
        }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: "#111827" }}>
          Event not found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#4b5563" }}>
          The event you&apos;re looking for doesn&apos;t exist.
        </Typography>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Button variant="contained">Back to Dashboard</Button>
        </Link>
      </Card>
    );
  }

  const status = getEventStatus(event);
  const isOwner = event.organizerId === user?.id;
  const canEdit = canEditEvent(event);
  const canDelete = canDeleteEvent(event);
  const disabledReason = getEditDeleteReason(event);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "56rem",
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Link
        href="/dashboard"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Back to Dashboard
      </Link>

      <Card sx={{ border: "1px solid #d8dee8", overflow: "hidden" }}>
        <CardHeader sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "flex-start" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 1.75,
                  fontWeight: 800,
                  color: "#172033",
                  fontSize: { xs: "1.65rem", md: "2.125rem" },
                  wordBreak: "break-word",
                }}
              >
                {event.title}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Badge
                  label={event.eventType}
                  sx={{
                    bgcolor: eventTypeColors[event.eventType].bg,
                    color: eventTypeColors[event.eventType].color,
                    fontWeight: 700,
                  }}
                />
                <Badge
                  label={
                    event.category.charAt(0).toUpperCase() +
                    event.category.slice(1)
                  }
                  sx={{
                    bgcolor: categoryColors[event.category].bg,
                    color: categoryColors[event.category].color,
                    fontWeight: 700,
                  }}
                />
                <Badge
                  label={status}
                  sx={{
                    bgcolor: statusColors[status].bg,
                    color: statusColors[status].color,
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardHeader>

        <CardContent sx={{ display: "grid", gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#111827" }}>
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#374151", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {event.description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              borderTop: "1px solid #e5e7eb",
              pt: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#6b7280" }}>
                Date
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.05rem", color: "#111827" }}>
                {formatEventDateRange(event.startDateTime, event.endDateTime)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#6b7280" }}>
                Time
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.05rem", color: "#111827" }}>
                {formatEventTime(event.startDateTime)} -{" "}
                {formatEventTime(event.endDateTime)}
              </Typography>
            </Box>

            {event.eventType === "In-Person" && event.location && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#6b7280" }}>
                  Location
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.05rem", color: "#111827", wordBreak: "break-word" }}>
                  {event.location}
                </Typography>
              </Box>
            )}

            {event.eventType === "Online" && event.eventLink && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#6b7280" }}>
                  Event Link
                </Typography>
                <Box
                  component="a"
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "1.05rem",
                    color: "#2563eb",
                    textDecoration: "none",
                    wordBreak: "break-all",
                    "&:hover": { color: "#1d4ed8" },
                  }}
                >
                  Join Event
                </Box>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#6b7280" }}>
                Organizer
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.05rem", color: "#111827" }}>
                {event.organizerName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: "#6b7280" }}>
                Created
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.05rem", color: "#111827" }}>
                {formatEventDate(event.createdAt)}
              </Typography>
            </Box>
          </Box>

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            eventTitle={event.title}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            isLoading={isDeleting}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
