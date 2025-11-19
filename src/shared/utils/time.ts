export function totalSecondsToMinutesSecondDisplay(totalSeconds: number) {
    const minutes = math.round(totalSeconds / 60);
    const seconds = math.round(totalSeconds % 60);
    return `${minutes >= 10 ? "" : " " + minutes}:${seconds >= 10 ? "" : "0" + seconds}`;
}
