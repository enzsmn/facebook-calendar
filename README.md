# Facebook calendar

This project is a middleware to filter your Facebook event feed on event statuses.

Inspired by [simonbengtsson/eventcal](https://github.com/simonbengtsson/eventcal).

## Usage

Go to Facebook → Events → See All, right-click the "Add to Calendar" button and copy the target (e.g. https://www.facebook.com/events/ical/upcoming/?uid=123&key=abc).

Take the query parameters `uid` and `key` from the URL's query string.

Replace the placeholders in the URLs below with your values and subscribe to the desired feed(s) in your calendar app.

```
https://facebook-calendar.vercel.app/all?uid=<UID>&key=<KEY>
https://facebook-calendar.vercel.app/maybe?uid=<UID>&key=<KEY>
https://facebook-calendar.vercel.app/going?uid=<UID>&key=<KEY>
```

## Development

Test locally with [Vercel CLI](https://vercel.com/docs/cli) by running `vercel dev`.
