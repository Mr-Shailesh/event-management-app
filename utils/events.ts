import dayjs from "dayjs";
import { Event, FilterOptions } from "@/types";

export function checkEventOverlap(
  newEvent: { startDateTime: string; endDateTime: string },
  existingEvents: Event[],
  excludeEventId?: string,
): Event | null {
  const newStart = dayjs(newEvent.startDateTime).valueOf();
  const newEnd = dayjs(newEvent.endDateTime).valueOf();

  for (const event of existingEvents) {
    if (excludeEventId && event.id === excludeEventId) {
      continue;
    }

    const existingStart = dayjs(event.startDateTime).valueOf();
    const existingEnd = dayjs(event.endDateTime).valueOf();

    if (newStart < existingEnd && newEnd > existingStart) {
      return event;
    }
  }

  return null;
}

export function filterAndSortEvents(
  events: Event[],
  filters: FilterOptions,
): Event[] {
  let filtered = [...events];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        (event.location?.toLowerCase().includes(query) ?? false),
    );
  }

  if (filters.eventType !== "all") {
    filtered = filtered.filter(
      (event) => event.eventType === filters.eventType,
    );
  }

  if (filters.category !== "all") {
    filtered = filtered.filter((event) => event.category === filters.category);
  }

  if (filters.dateFrom) {
    const fromDate = dayjs(filters.dateFrom).startOf("day");
    filtered = filtered.filter(
      (event) => !dayjs(event.startDateTime).isBefore(fromDate),
    );
  }

  if (filters.dateTo) {
    const toDate = dayjs(filters.dateTo).endOf("day");
    filtered = filtered.filter(
      (event) => !dayjs(event.startDateTime).isAfter(toDate),
    );
  }

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "date":
        comparison =
          dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf();
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
    }

    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  return filtered;
}

export function formatEventDate(dateString: string): string {
  return dayjs(dateString).format("MMM D, YYYY");
}

export function formatEventTime(dateString: string): string {
  return dayjs(dateString).format("hh:mm A");
}

export function getEventStatus(event: Event): string {
  const now = dayjs();
  const startDate = dayjs(event.startDateTime);
  const endDate = dayjs(event.endDateTime);

  if (now.isAfter(endDate)) {
    return "Completed";
  } else if (now.isAfter(startDate) && now.isBefore(endDate)) {
    return "Ongoing";
  } else {
    return "Upcoming";
  }
}

export function canEditEvent(event: Event): boolean {
  const status = getEventStatus(event);
  return status === "Upcoming";
}

export function canDeleteEvent(event: Event): boolean {
  const status = getEventStatus(event);
  return status === "Upcoming";
}

export function getEditDeleteReason(event: Event): string {
  const status = getEventStatus(event);
  if (status === "Completed") {
    return "Cannot edit or delete completed events";
  } else if (status === "Ongoing") {
    return "Cannot edit or delete ongoing events";
  }
  return "";
}
