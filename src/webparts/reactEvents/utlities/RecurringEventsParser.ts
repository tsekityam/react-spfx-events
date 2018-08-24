import { SPEvent } from "../components/ReactEventsContainer";
import { RBCEvent } from "../components/IReactEventsProps";
import * as xml2js from "xml2js";
import * as moment from "moment";

interface IRepeatWeekly {
  $su?: boolean;
  $mo?: boolean;
  $tu?: boolean;
  $we?: boolean;
  $th?: boolean;
  $fr?: boolean;
  $sa?: boolean;
  $weekFrequency: number;
}

interface IRepeatDaily {
  $weekday?: boolean;
  $dayFrequency?: number;
}

interface IRepeatMonthly {
  $day: number;
  $monthFrequency: number;
}

interface IRepeatMonthlyByDay {
  $su?: boolean;
  $mo?: boolean;
  $tu?: boolean;
  $we?: boolean;
  $th?: boolean;
  $fr?: boolean;
  $sa?: boolean;
  $monthFrequency: number;
  $weekdayOfMonth: string; // "first", "second", "third", "fourth", "last"
}

interface IRepeatYearly {
  $day: number;
  $month: number; // from 1 to 12
  $yearFrequency: number;
}

interface IRepeatYearlyByDay {
  $month: number; // from 1 to 12
  $su?: boolean;
  $mo?: boolean;
  $tu?: boolean;
  $we?: boolean;
  $th?: boolean;
  $fr?: boolean;
  $sa?: boolean;
  $weekdayOfMonth: string; // "first", "second", "third", "fourth", "last"
  $yearFrequency: number;
}

interface IRepeat {
  weekly?: IRepeatWeekly;
  daily?: IRepeatDaily;
  monthly?: IRepeatMonthly;
  monthlyByDay?: IRepeatMonthlyByDay;
  yearly?: IRepeatYearly;
  yearlyByDay?: IRepeatYearlyByDay;
}

interface IRecurrenceData {
  recurrence: {
    rule: {
      firstDayOfWeek: string;
      repeat: IRepeat;
      repeatInstances?: number;
      repeatForever?: boolean;
      windowEnd?: string; // date string, i.e. "2018-08-27T05:00:00Z"
    };
  };
}

export default class RecurringEventsParser {
  public static parse(event: SPEvent): RBCEvent[] {
    let options: any = {
      mergeAttrs: true,
      explicitArray: false,
      attrValueProcessors: [
        xml2js.processors.parseNumbers,
        xml2js.processors.parseBooleans
      ],
      valueProcessors: [
        xml2js.processors.parseNumbers,
        xml2js.processors.parseBooleans
      ]
    };

    xml2js.parseString(
      event.RecurrenceData,
      options,
      (err: any, result: any): void => {
        console.dir(err);
        console.dir(result);
      }
    );

    // let recurrenceData: IRecurrenceData = xml2js.stringToJs(
    //   event.RecurrenceData
    // );
    // let repeat: IRepeat = recurrenceData.recurrence.rule.repeat;
    // if (repeat.daily) {
    //   return this.parseDaily(event);
    // } else if (repeat.monthly) {
    //   return this.parseMonthly(event);
    // } else if (repeat.monthlyByDay) {
    // } else if (repeat.yearly) {
    // } else if (repeat.yearlyByDay) {
    // }
    return [];
  }

  // private static parseDaily(value: SPEvent): RBCEvent[] {
  //   let recurrenceData: IRecurrenceData = xml2js.stringToJs(
  //     value.RecurrenceData
  //   );
  //   let repeat: IRepeat = recurrenceData.recurrence.rule.repeat;
  //   let rule: IRepeatDaily = repeat.daily;

  //   let events: RBCEvent[] = [];

  //   if (rule.$weekday) {
  //     for (
  //       let m: moment.Moment = moment(value.EventDate);
  //       m.isBefore(moment(value.EndDate));
  //       m.add(1, "d")
  //     ) {
  //       let n: moment.Moment = moment(m);

  //       if (0 < n.day() && n.day() < 6) {
  //         events.push({
  //           start: n.toDate(),
  //           end: n.add(parseInt(value.Duration), "s").toDate(),
  //           title: value.Title,
  //           allDay: value.fAllDayEvent === true
  //         });
  //       }
  //     }
  //   } else if (rule.$dayFrequency) {
  //     for (
  //       let m: moment.Moment = moment(value.EventDate);
  //       m.isBefore(moment(value.EndDate));
  //       m.add(rule.$dayFrequency, "d")
  //     ) {
  //       let n: moment.Moment = moment(m);
  //       events.push({
  //         start: n.toDate(),
  //         end: n.add(parseInt(value.Duration), "s").toDate(),
  //         title: value.Title,
  //         allDay: value.fAllDayEvent === true
  //       });
  //     }
  //   }

  //   return events;
  // }

  // private static parseMonthly(value: SPEvent): RBCEvent[] {
  //   return [];
  // }
}
