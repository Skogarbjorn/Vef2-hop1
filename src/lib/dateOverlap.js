import { DateTime, Duration } from 'luxon';

function parseInterval(intervalStr) {
  const regex = /(\d+)\s*(hour|minute|second|day)s?/gi;
  const durationObj = {};

  let match;
  while ((match = regex.exec(intervalStr)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    durationObj[unit] = value; 
  }

  return Duration.fromObject(durationObj);
}

function addIntervalToDate(date, interval) {
	return date.plus(interval);
}

export function doIntervalsIntersect(date1, interval1, date2, interval2) {
	const start1 = DateTime.fromJSDate(date1);
	const start2 = DateTime.fromJSDate(date2);

	const end1 = addIntervalToDate(start1, parseInterval(interval1));
	const end2 = addIntervalToDate(start2, interval2);

	return start1 <= end2 && start2 <= end1;
}
