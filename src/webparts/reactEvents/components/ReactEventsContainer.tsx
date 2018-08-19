import * as React from "react";
import { IReactEventsContainerProps } from "./IReactEventsContainerProps";
import ReactEvents from "./ReactEvents";
import { Web } from "@pnp/sp";
import { IReactEventsContainerState } from "./IReactEventsContainerState";
import { RBCEvent } from "./IReactEventsProps";
import EventParser from "../utlities/EventParser";
import RecurringEventsParser from "../utlities/RecurringEventsParser";

export interface SPEvent {
  Description: string;
  Duration: string;
  EndDate: string;
  EventDate: string;
  fAllDayEvent: boolean;
  fRecurrence: boolean;
  Id: number;
  Location: string;
  Title: string;

  // defaults for properties related to recurring event processing
  EventType: number;
  MasterSeriesItemID: number;
  RecurrenceData: string;
  RecurrenceID: string;
  TimeZone: number;
  UID: string;
}

export default class ReactEventsContainer extends React.Component<
  IReactEventsContainerProps,
  IReactEventsContainerState
> {
  constructor(props: IReactEventsContainerProps) {
    super(props);
    this.state = { events: [] };
  }

  public render(): React.ReactElement<IReactEventsContainerProps> {
    return (
      <ReactEvents events={this.state.events} timeZone={this.props.timeZone} />
    );
  }

  public componentWillReceiveProps(nextProps) {
    this.fetchEvents(nextProps.siteUrl, nextProps.listId);
  }

  public componentDidMount() {
    this.fetchEvents(this.props.siteUrl, this.props.listId);
  }

  private fetchEvents(siteUrl: string, listId: string) {
    new Web(siteUrl).lists
      .getById(listId)
      .items.select(
        "*",
        "Duration",
        "RecurrenceData",
        "EventType",
        "MasterSeriesItemID",
        "RecurrenceID",
        "TimeZone",
        "UID"
      )
      .getAll()
      .then((result: SPEvent[]) => {
        let events: RBCEvent[] = [];

        result.map((value: SPEvent) => {
          if (value.fRecurrence === true) {
            events = events.concat(RecurringEventsParser.parse(value));
          } else {
            events.push(EventParser.parse(value));
          }
        });
        this.setState({ events: events }, () => {});
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
