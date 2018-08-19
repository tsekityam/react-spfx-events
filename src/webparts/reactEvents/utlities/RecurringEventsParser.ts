import { SPEvent } from "../components/ReactEventsContainer";
import { RBCEvent } from "../components/IReactEventsProps";
import * as JXON from "jxon";
import * as moment from "moment";

interface IRepeatWeekly {
  $su?: string; // "True", "False"
  $mo?: string; // "True", "False"
  $tu?: string; // "True", "False"
  $we?: string; // "True", "False"
  $th?: string; // "True", "False"
  $fr?: string; // "True", "False"
  $sa?: string; // "True", "False"
  $weekFrequency: string; // number string
}

interface IRepeatDaily {
  $weekday?: string; // "True", "False"
  $dayFrequency?: string; // number string
}

interface IRepeatMonthly {
  $day: string; // number string
  $monthFrequency: string; // number string
}

interface IRepeatMonthlyByDay {
  $su?: string; // "True", "False"
  $mo?: string; // "True", "False"
  $tu?: string; // "True", "False"
  $we?: string; // "True", "False"
  $th?: string; // "True", "False"
  $fr?: string; // "True", "False"
  $sa?: string; // "True", "False"
  $monthFrequency: string; // number
  $weekdayOfMonth: string; // "first", "second", "third", "fourth", "last"
}

interface IRepeatYearly {
  $day: string; // number string
  $month: string; // number string from 1 to 12
  $yearFrequency: string;
}

interface IRepeatYearlyByDay {
  $month: string; // number string from 1 to 12
  $su?: string; // "True", "False"
  $mo?: string; // "True", "False"
  $tu?: string; // "True", "False"
  $we?: string; // "True", "False"
  $th?: string; // "True", "False"
  $fr?: string; // "True", "False"
  $sa?: string; // "True", "False"
  $weekdayOfMonth: string; // "first", "second", "third", "fourth", "last"
  $yearFrequency: string; // number
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
      repeatInstances?: string; // number string
      repeatForever?: string; // "True", "False"
      windowEnd?: string; // date string, i.e. "2018-08-27T05:00:00Z"
    };
  };
}

export default class RecurringEventsParser {
  public static parse(event: SPEvent): RBCEvent[] {
    // console.log(event);
    let recurrenceData: IRecurrenceData = JXON.stringToJs(event.RecurrenceData);
    let repeat: IRepeat = recurrenceData.recurrence.rule.repeat;
    if (repeat.daily) {
      return this.parseDaily(event);
    } else if (repeat.monthly) {
      return this.parseMonthly(event);
    } else if (repeat.monthlyByDay) {
    } else if (repeat.yearly) {
    } else if (repeat.yearlyByDay) {
    }
    return [];
  }

  private static parseDaily(value: SPEvent): RBCEvent[] {
    let recurrenceData: IRecurrenceData = JXON.stringToJs(value.RecurrenceData);
    let repeat: IRepeat = recurrenceData.recurrence.rule.repeat;
    let rule = repeat.daily;

    let events: RBCEvent[] = [];

    if (rule.$weekday) {
      for (
        let m: moment.Moment = moment(value.EventDate);
        m.isBefore(moment(value.EndDate));
        m.add(1, "d")
      ) {
        let n: moment.Moment = moment(m);

        if (0 < n.day() && n.day() < 6) {
          events.push({
            start: n.toDate(),
            end: n.add(parseInt(value.Duration), "s").toDate(),
            title: value.Title,
            allDay: value.fAllDayEvent === true
          });
        }
      }
    } else if (rule.$dayFrequency) {
      for (
        let m: moment.Moment = moment(value.EventDate);
        m.isBefore(moment(value.EndDate));
        m.add(rule.$dayFrequency, "d")
      ) {
        let n: moment.Moment = moment(m);
        events.push({
          start: n.toDate(),
          end: n.add(parseInt(value.Duration), "s").toDate(),
          title: value.Title,
          allDay: value.fAllDayEvent === true
        });
      }
    }

    return events;
  }

  private static parseMonthly(value: SPEvent): RBCEvent[] {
    return [];
  }
}
