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

            for (const k in data) {
                if (data[k].type !== 'VEVENT' || !data.hasOwnProperty(k)) {
                    continue;
                }

                const event = data[k];
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

            if (request.query.status === 'going') {
                calendarGoing.serve(response);
                return;
            }

            if (request.query.status === 'maybe') {
                calendarMaybe.serve(response);
                return;
            }

            calendarAll.serve(response);
        }
    );
};
