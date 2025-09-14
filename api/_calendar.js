import icalReader from "node-ical";
import ical from "ical-generator";

export default async (category, request, response) => {
    if (!request.query.uid) {
        response.status(400).send('Missing uid');
        return;
    }

    if (!request.query.key) {
        response.status(400).send('Missing key');
        return;
    }

    const calendar = ical({name: `Facebook events (${category})`});

    icalReader.fromURL(
        `https://www.facebook.com/events/ical/upcoming/?uid=${request.query.uid}&key=${request.query.key}`,
        null,
        function (error, data) {
            if (error) {
                console.log(error);
                response.status(500).send('Error');
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
                    category === 'maybe' && event.partstat === 'TENTATIVE' ||
                    category === 'going' && event.partstat === 'ACCEPTED'
                ) {
                    calendar.createEvent(mappedEvent);
                }
            }

            response.setHeader('Cache-Control', 's-maxage=14400');
            response.send(calendar.toString());
        });
}
