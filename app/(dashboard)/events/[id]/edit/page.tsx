"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Box, Typography } from "@mui/material";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import { EventForm } from "@/components/EventForm";
import { Card, Button, Spinner } from "@/components/mui";
import { checkEventOverlap } from "@/utils/events";

interface EventFormValues {
  title: string;
  description: string;
  eventType: "Online" | "In-Person";
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category:
    | "business"
    | "education"
    | "entertainment"
    | "sports"
    | "technology"
    | "health"
    | "other";
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { getEventById, updateEvent, events } = useEvents();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const foundEvent = getEventById(eventId);
    if (!foundEvent) {
      setIsNotFound(true);
      return;
    }

    if (foundEvent.organizerId !== user?.id) {
      toast.error("You can only edit your own events");
      router.push("/dashboard");
      return;
    }

    setEvent(foundEvent);
  }, [eventId, getEventById, user, router]);

  if (!event && !isNotFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="h-8 w-8" />
          <p className="text-gray-500">Loading event...</p>
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <Card
        sx={{
          maxWidth: "42rem",
          mx: "auto",
          my: 8,
          p: 4,
          textAlign: "center",
          border: "1px solid #d8dee8",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 1, fontWeight: 700, color: "#172033" }}
        >
          Event not found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#5d6b82" }}>
          The event you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </Typography>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1f1f1f", "&:hover": { bgcolor: "#111111" } }}
          >
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    );
  }

  const handleSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
    try {
      const overlap = checkEventOverlap(
        {
          startDateTime: values.startDateTime,
          endDateTime: values.endDateTime,
        },
        events,
        eventId,
      );

      if (overlap) {
        toast.error(
          `This time slot is already booked. It conflicts with "${overlap.title}".`,
        );
        setIsLoading(false);
        return;
      }

      await updateEvent(eventId, {
        title: values.title,
        description: values.description,
        eventType: values.eventType,
        location: values.location,
        eventLink: values.eventLink,
        startDateTime: values.startDateTime,
        endDateTime: values.endDateTime,
        category: values.category,
      });

      toast.success("Event updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update event");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <Box
      sx={{
        maxWidth: "1100px",
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", color: "#2563eb", fontWeight: 600 }}
        >
          ← Back to Dashboard
        </Link>
      </Box>

      <EventForm
        initialEvent={event}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitButtonText="Update Event"
        cardTitle="Update Event Details"
        cardDescription="Adjust the fields below and save when everything looks right."
      />
    </Box>
  );
}
