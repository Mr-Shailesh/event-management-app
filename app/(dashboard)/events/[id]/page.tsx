"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import {
  formatEventDate,
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="h-8 w-8" />
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <Card className="max-w-2xl mx-auto my-8 p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Event not found
        </h2>
        <p className="text-gray-600 mb-6">
          The event you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
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
    <div className="max-w-3xl mx-auto py-8">
      <Link
        href="/dashboard"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <Card sx={{ border: "1px solid #d8dee8" }}>
        <CardHeader sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{ mb: 1.75, fontWeight: 800, color: "#172033" }}
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

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Date</h3>
              <p className="text-lg text-gray-900">
                {formatEventDate(event.startDateTime)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Time</h3>
              <p className="text-lg text-gray-900">
                {formatEventTime(event.startDateTime)} -{" "}
                {formatEventTime(event.endDateTime)}
              </p>
            </div>

            {event.eventType === "In-Person" && event.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Location
                </h3>
                <p className="text-lg text-gray-900">{event.location}</p>
              </div>
            )}

            {event.eventType === "Online" && event.eventLink && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Event Link
                </h3>
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:text-blue-800 break-all"
                >
                  Join Event
                </a>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Organizer
              </h3>
              <p className="text-lg text-gray-900">{event.organizerName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Created
              </h3>
              <p className="text-lg text-gray-900">
                {formatEventDate(event.createdAt)}
              </p>
            </div>
          </div>

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            eventTitle={event.title}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            isLoading={isDeleting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
