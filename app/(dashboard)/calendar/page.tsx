"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import {
  Calendar,
  dayjsLocalizer,
  type Event as CalendarEvent,
} from "react-big-calendar";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Button } from "@/components/mui";
import { useEvents } from "@/context/EventsContext";
import { useAuth } from "@/context/AuthContext";
import { formatEventDateRange, formatEventTime } from "@/utils/events";
import { type Event } from "@/types";

const localizer = dayjsLocalizer(dayjs);
const CALENDAR_VIEWS = ["month", "week", "day", "agenda"] as const;
type CalendarView = (typeof CALENDAR_VIEWS)[number];

type CalendarEventItem = CalendarEvent & {
  resource?: {
    id: string;
    eventType: string;
    isOwner: boolean;
    event: Event;
  };
};

export default function CalendarPage() {
  const { events } = useEvents();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("month");

  const calendarEvents = useMemo<CalendarEventItem[]>(
    () =>
      events.map((event) => ({
        title: event.title,
        start: dayjs(event.startDateTime).toDate(),
        end: dayjs(event.endDateTime).toDate(),
        allDay: false,
        resource: {
          id: event.id,
          eventType: event.eventType,
          isOwner: event.organizerId === user?.id,
          event,
        },
      })),
    [events, user?.id],
  );

  const currentLabel = useMemo(() => {
    const date = dayjs(currentDate);

    switch (currentView) {
      case "month":
        return date.format("MMMM YYYY");
      case "week":
        return `${date.startOf("week").format("MMM D")} - ${date
          .endOf("week")
          .format("MMM D, YYYY")}`;
      case "day":
        return date.format("MMMM D, YYYY");
      case "agenda":
        return `Agenda for ${date.format("MMMM YYYY")}`;
      default:
        return date.format("MMMM YYYY");
    }
  }, [currentDate, currentView]);

  const handleNavigate = (direction: "prev" | "next") => {
    const baseDate = dayjs(currentDate);
    const amount = direction === "next" ? 1 : -1;

    const nextDate =
      currentView === "month"
        ? baseDate.add(amount, "month")
        : currentView === "week"
          ? baseDate.add(amount, "week")
          : currentView === "day"
            ? baseDate.add(amount, "day")
            : baseDate.add(amount, "month");

    setCurrentDate(nextDate.toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
  };

  return (
    <Box
      sx={{
        maxWidth: "1500px",
        mx: "auto",
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
            Event Calendar
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#5d6b82", fontSize: "1.05rem" }}
          >
            Browse all events in calendar view and open any event for details.
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
          border: "1px solid #d8dee8",
          borderRadius: "18px",
          bgcolor: "#fff",
          p: { xs: 2, md: 3 },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", lg: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={() => handleNavigate("prev")}
              sx={{ borderRadius: "10px", minWidth: 96 }}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setCurrentDate(new Date())}
              sx={{ borderRadius: "10px", minWidth: 84 }}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => handleNavigate("next")}
              sx={{ borderRadius: "10px", minWidth: 84 }}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleNextMonth}
              sx={{ borderRadius: "10px", minWidth: 120 }}
            >
              Next Month
            </Button>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#172033",
              textAlign: { xs: "left", lg: "center" },
            }}
          >
            {currentLabel}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {CALENDAR_VIEWS.map((view) => (
              <Button
                key={view}
                type="button"
                variant={currentView === view ? "contained" : "outlined"}
                onClick={() => setCurrentView(view)}
                sx={{
                  borderRadius: "10px",
                  minWidth: 84,
                  textTransform: "capitalize",
                  bgcolor: currentView === view ? "#1f1f1f" : undefined,
                  "&:hover": {
                    bgcolor: currentView === view ? "#111111" : undefined,
                  },
                }}
              >
                {view === "agenda" ? "Event" : view}
              </Button>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            "& .rbc-calendar": {
              minHeight: { xs: 620, md: 760 },
              fontFamily: "inherit",
              color: "#172033",
            },
            "& .rbc-header": {
              padding: "12px 6px",
              fontWeight: 700,
              color: "#334155",
              borderColor: "#e2e8f0",
              backgroundColor: "#f8fafc",
            },
            "& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view table": {
              borderColor: "#e2e8f0",
            },
            "& .rbc-day-bg + .rbc-day-bg, & .rbc-month-row + .rbc-month-row": {
              borderColor: "#e2e8f0",
            },
            "& .rbc-today": {
              backgroundColor: "#eef4ff",
            },
            "& .rbc-off-range-bg": {
              backgroundColor: "#f8fafc",
            },
            "& .rbc-event": {
              backgroundColor: "#2f5bea",
              borderRadius: "8px",
              border: "none",
              padding: "2px 8px",
              boxShadow: "none",
            },
            "& .rbc-event-content": {
              fontSize: "0.875rem",
              fontWeight: 600,
            },
          }}
        >
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            views={[...CALENDAR_VIEWS]}
            view={currentView}
            date={currentDate}
            onView={(view) => setCurrentView(view as CalendarView)}
            onNavigate={(date) => setCurrentDate(date)}
            toolbar={false}
            drilldownView="day"
            popup
            selectable={false}
            onSelectEvent={(selectedCalendarEvent) => {
              if (selectedCalendarEvent.resource?.event) {
                setSelectedEvent(selectedCalendarEvent.resource.event);
              }
            }}
          />
        </Box>
      </Box>

      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}
                >
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: "#5d6b82" }}>
                  {selectedEvent.description}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}
                >
                  Date
                </Typography>
                <Typography variant="body2" sx={{ color: "#5d6b82" }}>
                  {formatEventDateRange(
                    selectedEvent.startDateTime,
                    selectedEvent.endDateTime,
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}
                >
                  Time
                </Typography>
                <Typography variant="body2" sx={{ color: "#5d6b82" }}>
                  {formatEventTime(selectedEvent.startDateTime)} -{" "}
                  {formatEventTime(selectedEvent.endDateTime)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}
                >
                  Organizer
                </Typography>
                <Typography variant="body2" sx={{ color: "#5d6b82" }}>
                  {selectedEvent.organizerName}
                </Typography>
              </Box>

              {selectedEvent.eventType === "In-Person" &&
                selectedEvent.location && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}
                    >
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5d6b82" }}>
                      {selectedEvent.location}
                    </Typography>
                  </Box>
                )}

              {selectedEvent.eventType === "Online" &&
                selectedEvent.eventLink && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}
                    >
                      Event Link
                    </Typography>
                    <Typography
                      component="a"
                      href={selectedEvent.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        color: "#2563eb",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Join Event
                    </Typography>
                  </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
