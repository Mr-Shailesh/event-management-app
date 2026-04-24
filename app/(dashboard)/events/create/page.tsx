"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Box, Typography } from "@mui/material";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import { EventForm } from "@/components/EventForm";
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

export default function CreateEventPage() {
  const router = useRouter();
  const { addEvent, events } = useEvents();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: EventFormValues) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const overlap = checkEventOverlap(
        {
          startDateTime: values.startDateTime,
          endDateTime: values.endDateTime,
        },
        events,
      );

      if (overlap) {
        toast.error(
          `This time slot is already booked. It conflicts with "${overlap.title}".`,
        );
        setIsLoading(false);
        return;
      }

      await addEvent({
        title: values.title,
        description: values.description,
        eventType: values.eventType,
        location: values.location,
        eventLink: values.eventLink,
        startDateTime: values.startDateTime,
        endDateTime: values.endDateTime,
        category: values.category,
        organizerId: user.id,
        organizerName: user.username,
      });

      toast.success("Event created successfully!");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create event");
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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        submitButtonText="Create Event"
        cardTitle="Create Event "
        cardDescription="Fill out the information below to publish your new event."
      />
    </Box>
  );
}
