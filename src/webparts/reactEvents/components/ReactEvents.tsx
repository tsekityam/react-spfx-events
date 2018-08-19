import * as React from "react";
import styles from "./ReactEvents.module.scss";
import { IReactEventsProps, RBCEvent } from "./IReactEventsProps";
import BigCalendar from "react-big-calendar";
import * as moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

BigCalendar.momentLocalizer(moment);

export default class ReactEvents extends React.Component<
  IReactEventsProps,
  {}
> {
  public render(): React.ReactElement<IReactEventsProps> {
    return (
      <BigCalendar
        className={styles.calendar}
        events={this.props.events}
        allDayAccessor={this.allDayAccessor}
        startAccessor={this.startAccessor}
        endAccessor={this.endAccessor}
        titleAccessor={this.titleAccessor}
      />
    );
  }

  private allDayAccessor = (event: RBCEvent): boolean => {
    return event.allDay == true;
  };

  private startAccessor = (event: RBCEvent): Date => {
    return event.start;
  };

  private endAccessor = (event: RBCEvent): Date => {
    return event.end;
  };

  private titleAccessor = (event: RBCEvent): string => {
    return event.title;
  };
}
