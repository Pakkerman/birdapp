import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

export function getRelativeTime(timeString: Date) {
  dayjs.extend(relativeTime)
  dayjs.extend(updateLocale)

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
