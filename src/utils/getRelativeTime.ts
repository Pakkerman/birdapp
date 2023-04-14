import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

export function getRelativeTime(timeString: Date | undefined) {
  if (timeString == undefined) return "Now"

  dayjs.updateLocale("en", {
    relativeTime: {
      past: "%s",
      s: "now",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1M",
      MM: "%dM",
      y: "1Y",
      yy: "%dY",
    },
  })

  return dayjs(timeString).fromNow()
}
