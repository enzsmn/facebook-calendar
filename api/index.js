const icalGenerator = require('ical-generator');
const icalReader = require('node-ical');

module.exports = async (request, response) => {
    if (!request.query.password || request.query.password !== process.env.PASSWORD) {
        response.send(400, 'Unauthorized');
        return;
    }

    const calendarAll = icalGenerator({name: 'Facebook events (all)'});
    const calendarGoing = icalGenerator({name: 'Facebook events (going)'});
    const calendarMaybe = icalGenerator({name: 'Facebook events (maybe)'});

    icalReader.fromURL(
        process.env.FACEBOOK_CALENDAR_URL,
        null,
        function (error, data) {
            if (error) {
                console.log(error);
                response.send(500, 'Error');
                return;
            }

            for (const key in data) {
                if (data[key].type !== 'VEVENT' || !data.hasOwnProperty(key)) {
                    continue;
                }

                const event = data[key];
                const mappedEvent = {
                    start: event.start,
                    end: event.end,
                    summary: event.summary,
                    description: event.description,
                    location: event.location,
                    url: event.url,
                };

                if (event.partstat === 'ACCEPTED') {
                    calendarGoing.createEvent(mappedEvent);
                }

                if (event.partstat === 'TENTATIVE') {
                    calendarMaybe.createEvent(mappedEvent);
                }

                calendarAll.createEvent(mappedEvent);
            }

            response.setHeader('Cache-Control', 's-maxage=21600');

            if (request.query.status === 'going') {
                response.send(calendarGoing.toString());
                return;
            }

            if (request.query.status === 'maybe') {
                response.send(calendarMaybe.toString());
                return;
            }

            response.send(calendarGoing.toString());
        });
};
