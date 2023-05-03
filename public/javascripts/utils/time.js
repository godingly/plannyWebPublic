import {DateTime, Duration} from 'luxon';

export function getDurString(duration) {
    if (duration.hours) return duration.toFormat("h:mm:ss");
    return duration.toFormat("m:ss");
}
  
export function subtractSeconds(duration, seconds=1) {
    return duration.minus({ seconds: seconds}).shiftTo("hour", "minute", "second");
}

export function addMinutes(dt, minutes=2) {
    return dt.plus({minutes: minutes})
}
  
export function addMinutesToDur(duration, minutes=2) {
    return duration.plus({ minutes: minutes }).shiftTo("hour", "minute", "second");
}
  
export function isZero(duration) {
    return duration.hours == 0 && duration.minutes == 0 && duration.seconds == 0;
}

export function getDuration(minutes=5, isDebug=false) {
    if (isDebug)
        {return Duration.fromObject({ seconds: minutes });}
    else
        {return Duration.fromObject({ minutes: minutes });}
}

export function getCountdownString(end, start) {
    if (start === undefined)
        start = DateTime.now();
    const divmod = (x, y) => [Math.floor(x / y), x % y];
    const diff_in_seconds = (end-start) / 1000;
    let hours, minutes, seconds, rest;
    [hours,rest]  = divmod(diff_in_seconds, 60*60);
    [minutes,seconds]  = divmod(rest, 60);
    const dur = Duration.fromObject({hours, minutes, seconds});
    return getDurString(dur);
}

export function getTimeNow(){
    return DateTime.now();
}

export function getTimeString(dt) {
    return dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
}

