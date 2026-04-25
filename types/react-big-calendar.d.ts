declare module "react-big-calendar" {
  import type { ComponentType, ReactNode } from "react";

  export interface Event {
    title?: ReactNode;
    start?: Date;
    end?: Date;
    allDay?: boolean;
    resource?: any;
  }

  export interface CalendarProps<TEvent extends Event = Event> {
    localizer: any;
    events: TEvent[];
    startAccessor?: keyof TEvent | ((event: TEvent) => Date);
    endAccessor?: keyof TEvent | ((event: TEvent) => Date);
    views?: string[];
    view?: string;
    date?: Date;
    defaultView?: string;
    popup?: boolean;
    selectable?: boolean;
    toolbar?: boolean;
    drilldownView?: string;
    onView?: (view: string) => void;
    onNavigate?: (date: Date) => void;
    onSelectEvent?: (event: TEvent) => void;
  }

  export const Calendar: ComponentType<CalendarProps>;
  export function dayjsLocalizer(dayjsInstance: any): any;
}
