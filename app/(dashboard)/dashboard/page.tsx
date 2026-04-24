"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { toast } from "sonner";
import { EventCard } from "@/components/EventCard";
import { Button, Input, Select, SelectItem } from "@/components/mui";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventsContext";
import { useFilters } from "@/context/FilterContext";
import { filterAndSortEvents } from "@/utils/events";

export default function DashboardPage() {
  const router = useRouter();
  const { events, deleteEvent } = useEvents();
  const { user } = useAuth();
  const {
    filters,
    setSearchQuery,
    setEventType,
    setCategory,
    setSortBy,
    setSortOrder,
  } = useFilters();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredEvents = useMemo(
    () => filterAndSortEvents(events, filters),
    [events, filters],
  );
  const myEvents = filteredEvents.filter(
    (event) => event.organizerId === user?.id,
  );
  const otherEvents = filteredEvents.filter(
    (event) => event.organizerId !== user?.id,
  );
  const greetingName = user?.username?.trim() || "there";

  const handleDeleteEvent = async (eventId: string) => {
    setIsDeleting(eventId);

    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/${eventId}/edit`);
  };

  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: "1500px",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 3,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              fontSize: { xs: "2rem", md: "2.25rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#182033",
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#5d6b82", fontSize: "1.05rem" }}
          >
            Welcome back, {greetingName}! You have {myEvents.length} event
            {myEvents.length !== 1 ? "s" : ""} to manage.
          </Typography>
        </Box>

        <Link href="/events/create" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              minWidth: 166,
              alignSelf: { xs: "flex-start", md: "center" },
              px: 3,
              py: 1.3,
              borderRadius: "12px",
              bgcolor: "#1f1f1f",
              boxShadow: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#111111",
                boxShadow: "none",
              },
            }}
          >
            Create New Event
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          mb: 5,
          border: "1px solid #d8dee8",
          borderRadius: "16px",
          bgcolor: "#ffffff",
          px: { xs: 2, md: 3 },
          py: { xs: 2.5, md: 3 },
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: 800, color: "#151c2e" }}
        >
          Filters & Search
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "2fr 1fr 1fr 1fr",
            },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#364256" }}
            >
              Search
            </Typography>
            <Input
              type="text"
              placeholder="Search events..."
              value={filters.searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: "#fff",
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#364256" }}
            >
              Event Type
            </Typography>
            <Select
              value={filters.eventType}
              onChange={(e: any) => setEventType(e.target.value)}
              sx={{ height: 48, borderRadius: "12px", bgcolor: "#fff" }}
            >
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="In-Person">In-Person</SelectItem>
            </Select>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#364256" }}
            >
              Category
            </Typography>
            <Select
              value={filters.category}
              onChange={(e: any) => setCategory(e.target.value)}
              sx={{ height: 48, borderRadius: "12px", bgcolor: "#fff" }}
            >
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </Select>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#364256" }}
            >
              Sort By
            </Typography>
            <Select
              value={filters.sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              sx={{ height: 48, borderRadius: "12px", bgcolor: "#fff" }}
            >
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </Select>
          </Box>

          <Box sx={{ maxWidth: { xs: "100%", lg: 200 } }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#364256" }}
            >
              Order
            </Typography>
            <Select
              value={filters.sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              sx={{ height: 48, borderRadius: "12px", bgcolor: "#fff" }}
            >
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {myEvents.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ mb: 3, fontSize: "2rem", fontWeight: 800, color: "#172033" }}
          >
            My Events
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {myEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isOwner={true}
                isDeleting={isDeleting === event.id}
                onEdit={() => handleEditEvent(event.id)}
                onDelete={handleDeleteEvent}
              />
            ))}
          </Box>
        </Box>
      )}

      {otherEvents.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{ mb: 1, fontSize: "2rem", fontWeight: 800, color: "#172033" }}
          >
            All Events
          </Typography>

          {myEvents.length === 0 && (
            <Typography variant="body1" sx={{ mb: 3, color: "#5d6b82" }}>
              {otherEvents.length} event{otherEvents.length !== 1 ? "s" : ""}{" "}
              available
            </Typography>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {otherEvents.map((event) => (
              <EventCard key={event.id} event={event} isOwner={false} />
            ))}
          </Box>
        </Box>
      )}

      {filteredEvents.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            bgcolor: "#fff",
            border: "1px solid #d8dee8",
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 1, fontWeight: 700, color: "#172033" }}
          >
            No events found
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#5d6b82" }}>
            {events.length === 0
              ? "Create your first event to get started"
              : "Try adjusting your filters"}
          </Typography>
          {events.length === 0 && (
            <Link href="/events/create" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#1f1f1f", "&:hover": { bgcolor: "#111111" } }}
              >
                Create Your First Event
              </Button>
            </Link>
          )}
        </Box>
      )}
    </Box>
  );
}
