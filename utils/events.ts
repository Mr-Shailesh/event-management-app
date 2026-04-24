import { Event, FilterOptions } from "@/types";

export function checkEventOverlap(
  newEvent: { startDateTime: string; endDateTime: string },
  existingEvents: Event[],
  excludeEventId?: string,
): Event | null {
  const newStart = new Date(newEvent.startDateTime).getTime();
  const newEnd = new Date(newEvent.endDateTime).getTime();

  for (const event of existingEvents) {
    if (excludeEventId && event.id === excludeEventId) {
      continue;
    }

    const existingStart = new Date(event.startDateTime).getTime();
    const existingEnd = new Date(event.endDateTime).getTime();

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

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "date":
        comparison =
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime();
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
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEventStatus(event: Event): string {
  const now = new Date();
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);

  if (now > endDate) {
    return "Completed";
  } else if (now > startDate && now < endDate) {
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
