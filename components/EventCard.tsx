"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Divider, Typography } from "@mui/material";
import { Card, CardContent, Badge, Button } from "@/components/mui";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Event } from "@/types";
import {
  formatEventDate,
  formatEventTime,
  getEventStatus,
  canEditEvent,
  canDeleteEvent,
  getEditDeleteReason,
} from "@/utils/events";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  isOwner?: boolean;
  isDeleting?: boolean;
}

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

export function EventCard({
  event,
  onEdit,
  onDelete,
  isOwner,
  isDeleting = false,
}: EventCardProps) {
  const status = getEventStatus(event);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const canEdit = canEditEvent(event);
  const canDelete = canDeleteEvent(event);
  const disabledReason = getEditDeleteReason(event);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "18px",
        border: "1px solid #d8dee8",
        boxShadow: "0 3px 10px rgba(15, 23, 42, 0.06)",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontSize: "1.05rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#1a1a1a",
              }}
            >
              {event.title}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Badge
                label={event.eventType}
                sx={{
                  height: 22,
                  borderRadius: "8px",
                  bgcolor: eventTypeColors[event.eventType].bg,
                  color: eventTypeColors[event.eventType].color,
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}
              />
              <Badge
                label={
                  event.category.charAt(0).toUpperCase() +
                  event.category.slice(1)
                }
                sx={{
                  height: 22,
                  borderRadius: "8px",
                  bgcolor: categoryColors[event.category].bg,
                  color: categoryColors[event.category].color,
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          <Badge
            label={status}
            sx={{
              mt: 0.25,
              alignSelf: "flex-start",
              borderRadius: "999px",
              bgcolor: statusColors[status].bg,
              color: statusColors[status].color,
              fontSize: "0.8125rem",
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>

      <CardContent
        sx={{ display: "flex", flexDirection: "column", gap: 2.25, pt: 0 }}
      >
        <Typography
          variant="body1"
          sx={{
            minHeight: 24,
            color: "#5d6b82",
            fontSize: "1rem",
            lineHeight: 1.55,
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: "grid", gap: 1.1 }}>
          <Typography variant="body1" sx={{ color: "#3e4b61" }}>
            <Box
              component="span"
              sx={{ mr: 1, fontWeight: 700, color: "#2b3445" }}
            >
              Date:
            </Box>
            {formatEventDate(event.startDateTime)}
          </Typography>

          <Typography variant="body1" sx={{ color: "#3e4b61" }}>
            <Box
              component="span"
              sx={{ mr: 1, fontWeight: 700, color: "#2b3445" }}
            >
              Time:
            </Box>
            {formatEventTime(event.startDateTime)} -{" "}
            {formatEventTime(event.endDateTime)}
          </Typography>

          <Typography variant="body1" sx={{ color: "#3e4b61" }}>
            <Box
              component="span"
              sx={{ mr: 1, fontWeight: 700, color: "#2b3445" }}
            >
              Organizer:
            </Box>
            {event.organizerName}
          </Typography>

          {event.eventType === "In-Person" && event.location && (
            <Typography variant="body1" sx={{ color: "#3e4b61" }}>
              <Box
                component="span"
                sx={{ mr: 1, fontWeight: 700, color: "#2b3445" }}
              >
                Location:
              </Box>
              {event.location}
            </Typography>
          )}

          {event.eventType === "Online" && event.eventLink && (
            <Typography variant="body1" sx={{ color: "#3e4b61" }}>
              <Box
                component="span"
                sx={{ mr: 1, fontWeight: 700, color: "#2b3445" }}
              >
                Link:
              </Box>
              <Box
                component="a"
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#2563eb",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Join Event
              </Box>
            </Typography>
          )}
        </Box>

        {isOwner ? (
          <>
            <Divider sx={{ mt: "auto", borderColor: "#d8dee8" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.25,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => onEdit?.(event)}
                disabled={!canEdit}
                title={!canEdit ? disabledReason : ""}
                sx={{
                  minHeight: 48,
                  borderRadius: "10px",
                  borderColor: "#d5dbe6",
                  color: "#1d273b",
                  fontWeight: 700,
                  bgcolor: "#fff",
                  "&:hover": {
                    borderColor: "#bfc7d5",
                    bgcolor: "#f8fafc",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#f5f7fb",
                    color: "#98a2b3",
                    borderColor: "#e4e7ec",
                  },
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowDeleteModal(true)}
                disabled={!canDelete || isDeleting}
                title={!canDelete ? disabledReason : ""}
                sx={{
                  minHeight: 48,
                  borderRadius: "10px",
                  bgcolor: canDelete ? "#ef4444" : "#fca5a5",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: canDelete ? "#dc2626" : "#fca5a5",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#f5b4b7",
                    color: "#fff",
                  },
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Box>
          </>
        ) : (
          <Link href={`/events/${event.id}`} className="mt-auto">
            <Button
              variant="contained"
              sx={{
                mt: "auto",
                width: "100%",
                minHeight: 48,
                borderRadius: "10px",
                bgcolor: "#1f1f1f",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#111111",
                  boxShadow: "none",
                },
              }}
            >
              View Details
            </Button>
          </Link>
        )}

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          eventTitle={event.title}
          isLoading={isDeleting}
          onConfirm={async () => {
            await onDelete?.(event.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      </CardContent>
    </Card>
  );
}
