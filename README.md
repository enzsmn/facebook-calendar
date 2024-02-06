# Facebook calendar

Inspired by [simonbengtsson/eventcal](https://github.com/simonbengtsson/eventcal).

## Setup

Copy `.env.example` to `.env`. 

Go to Facebook → Events → See All, right-click the "Add to Calendar" button and copy the target (e.g. https://www.facebook.com/events/ical/upcoming/?uid=123&key=abc).

Put this link and a random password in the `.env`.

## Develop

Test locally with [Vercel CLI](https://vercel.com/docs/cli) by running `vercel dev` and adding the password to the querystring:

```
http://localhost:3000/all?password=<PASSWORD>
http://localhost:3000/going?password=<PASSWORD>
http://localhost:3000/maybe?password=<PASSWORD>
```


## Deploy

Fill in your Vercel project's environment variables with the entries from `.env`.

Add your Vercel project's URL to your calendar application with the password and the optional status parameter:
