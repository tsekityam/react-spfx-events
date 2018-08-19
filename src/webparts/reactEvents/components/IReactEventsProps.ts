import { Event } from "react-big-calendar";

export interface RBCEvent extends Event {
  end: Date;
  start: Date;
  allDay: boolean;
  title: string;
}

export interface IReactEventsProps {
  events: RBCEvent[];
  timeZone: string;
}
