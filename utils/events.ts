import dayjs from "dayjs";
import { Event, FilterOptions } from "@/types";

function rangesOverlap(
  rangeAStart: dayjs.Dayjs,
  rangeAEnd: dayjs.Dayjs,
  rangeBStart: dayjs.Dayjs,
  rangeBEnd: dayjs.Dayjs,
) {
  return rangeAStart.isBefore(rangeBEnd) && rangeAEnd.isAfter(rangeBStart);
}

export function checkEventOverlap(
  newEvent: { startDateTime: string; endDateTime: string },
  existingEvents: Event[],
  excludeEventId?: string,
): Event | null {
  const newStart = dayjs(newEvent.startDateTime);
  const newEnd = dayjs(newEvent.endDateTime);

  for (const event of existingEvents) {
    if (excludeEventId && event.id === excludeEventId) {
      continue;
    }

    const existingStart = dayjs(event.startDateTime);
    const existingEnd = dayjs(event.endDateTime);

    if (rangesOverlap(newStart, newEnd, existingStart, existingEnd)) {
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

  if (filters.dateFrom || filters.dateTo) {
    const fromDate = filters.dateFrom
      ? dayjs(filters.dateFrom).startOf("day")
      : dayjs("1900-01-01").startOf("day");
    const toDate = filters.dateTo
      ? dayjs(filters.dateTo).endOf("day")
      : dayjs("9999-12-31").endOf("day");

    filtered = filtered.filter((event) =>
      rangesOverlap(
        dayjs(event.startDateTime),
        dayjs(event.endDateTime),
        fromDate,
        toDate,
      ),
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

export function formatEventDateRange(
  startDateString: string,
  endDateString: string,
): string {
  const start = dayjs(startDateString);
  const end = dayjs(endDateString);

  if (start.isSame(end, "day")) {
    return start.format("MMM D, YYYY");
  }

  if (start.isSame(end, "year")) {
    return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`;
  }

  return `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`;
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
