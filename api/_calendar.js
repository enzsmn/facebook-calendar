const icalGenerator = require("ical-generator");
const icalReader = require("node-ical");

module.exports = async (category, request, response) => {
    if (!request.query.password || request.query.password !== process.env.PASSWORD) {
        response.send(400, 'Unauthorized');
        return;
    }

    const calendar = icalGenerator({name: `Facebook events (${category})`});

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

                if (
                    category === 'all' ||
                    category === 'going' && event.partstat === 'ACCEPTED' ||
                    category === 'maybe' && event.partstat === 'TENTATIVE'
                ) {
                    calendar.createEvent(mappedEvent);
                }
            }

            response.setHeader('Cache-Control', 's-maxage=14400');
            response.send(calendar.toString());
        });
}
