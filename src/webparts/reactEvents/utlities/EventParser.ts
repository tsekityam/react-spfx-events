import { SPEvent } from "../components/ReactEventsContainer";
import { RBCEvent } from "../components/IReactEventsProps";
import * as moment from "moment";

export default class EventParser {
  public static parse(event: SPEvent): RBCEvent {
    if (event.fAllDayEvent === true) {
      return this.parseAllDayEvent(event);
    }
    return {
      start: moment(event.EventDate).toDate(),
      end: moment(event.EndDate).toDate(),
      allDay: false,
      title: event.Title
    };
  }

  private static parseAllDayEvent(event: SPEvent): RBCEvent {
    return {
      start: moment(
        moment(event.EventDate)
          .utc()
          .format("LL"),
        "MMMM DD, YYYY"
      )
        .startOf("day")
        .toDate(),
      end: moment(
        moment(event.EndDate)
          .utc()
          .format("LL"),
        "MMMM DD, YYYY"
      )
        .endOf("day")
        .toDate(),
      allDay: true,
      title: event.Title
    };
  }
}
