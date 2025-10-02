
function appendStructuredDataToHead(dataObject) {
    // Convert the object to a JSON string
    var jsonString = JSON.stringify(dataObject, null, 3);

    // Create a script tag with type 'application/ld+json'
    var scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';

    // Add the JSON string to the script tag
    scriptTag.textContent = jsonString;

    // Append the script tag to the head of the document
    document.head.appendChild(scriptTag);
}

function getDiviTextAfterColon(target_class) {

    // Find the element with the class name
    var eventTypeElement = document.querySelector(target_class);

    // If the element exists
    if (eventTypeElement) {
        // Get the text content of the element
        var textContent = eventTypeElement.textContent.trim();

        // Find the index of the colon
        var colonIndex = textContent.indexOf(':');

        // If colon is found
        if (colonIndex !== -1) {
            // Extract and return the trimmed text after the colon
            let extracted_text = textContent.substr(colonIndex + 1).trim();
            return extracted_text;
        }
    }

    console.log(`cant find ${target_class} or colon not found`);
    // If element doesn't exist or colon is not found, return null
    return null;
}

function getDiviTextAfterColonMultiple(target_class) {

    // Select all elements with class 'e-event-type'
    const elements = document.querySelectorAll(target_class);
    const eventTypeList = [];

    // Iterate over each element
    elements.forEach(element => {
        // Get the text content
        const text = element.textContent.trim();
        // Find the index of ':'
        const colonIndex = text.indexOf(':');
        // Extract the text after ':'
        const eventType = text.substring(colonIndex + 1).trim();
        // Push the trimmed text into the list
        eventTypeList.push(eventType);
    });

    return eventTypeList;

}

function getDiviText(target_class) {

    // Find the element with the class name
    var eventTypeElement = document.querySelector(target_class);

    // If the element exists
    if (eventTypeElement) {
        // Get the text content of the element
        var textContent = eventTypeElement.textContent.trim();

        // If colon is found
        if (textContent !== -1) {
            console.log(textContent);
            return textContent;
        }
    }
    console.log(`cant find ${target_class}`);

    return null;
};


function getDiviButtonURLsMultiple(target_class) {

    // Select all elements with class 'e-event-type'
    const elements = document.querySelectorAll(target_class);
    const URLSList = [];

    // Iterate over each element
    elements.forEach(element => {
        // Get the href attribute
        const href = element.getAttribute('href');

        URLSList.push(href);
    });

    return URLSList;

}


function getAllPNGUrls(className) {
    const elements = document.querySelectorAll(className);
    const pngUrls = [];

    function extractUrls(element) {
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.tagName === 'A') {
                const href = child.getAttribute('href');
                if (href.endsWith('.png')) {
                    pngUrls.push(href);
                }
            }
            extractUrls(child);
        }
    }

    elements.forEach(element => {
        extractUrls(element);
    });

    // Deduplicate the URLs
    return [...new Set(pngUrls)];
}



document.addEventListener("DOMContentLoaded", function () {
    // Check if an element with class 'e-name' exists
    if (document.querySelector('.e-name')) {
        // Your script to run when the element exists
        console.log("This is an event page");

        // build schema following https://developers.google.com/search/docs/appearance/structured-data/event 
        let schema = {};

        schema["@context"] = "https://schema.org";

        schema["@type"] = "Event";

        let event_name = getDiviText('.e-name');
        schema.name = event_name;

        let event_timezone_offset = getDiviTextAfterColon('.e-timezone-offset');

        let event_start_date = getDiviTextAfterColon('.e-start-date');
        let event_start_time = getDiviTextAfterColon('.e-start-time');

        // Format "2025-07-21T19:00-05:00"
        schema.startDate = `${event_start_date}T${event_start_time}${event_timezone_offset}`;

        let event_end_date = getDiviTextAfterColon('.e-end-date');
        let event_end_time = getDiviTextAfterColon('.e-end-time');

        schema.endDate = `${event_end_date}T${event_end_time}${event_timezone_offset}`;

        let attendanceModes = {
            "Offline": 'https://schema.org/OfflineEventAttendanceMode',
            "Online": 'https://schema.org/OnlineEventAttendanceMode',
            "Offline and Online": 'https://schema.org/MixedEventAttendanceMode',
        }

        var eventType = getDiviTextAfterColon('.e-event-attendance-mode');

        schema.eventAttendanceMode = attendanceModes[eventType];

        schema.eventStatus = "https://schema.org/EventScheduled"

        let location_names = getDiviTextAfterColonMultiple('.e-location-name'); // ['location 1', 'location 2']
        let location_types = getDiviTextAfterColonMultiple('.e-location-type');
        let location_urls = getDiviTextAfterColonMultiple('.e-location-url');
        let location_street_addresses = getDiviTextAfterColonMultiple('.e-streetAddress');
        let location_address_localities = getDiviTextAfterColonMultiple('.e-addressLocality');
        let location_postal_codes = getDiviTextAfterColonMultiple('.e-postalCode');
        let location_address_regions = getDiviTextAfterColonMultiple('.e-addressRegion');
        let location_address_countries = getDiviTextAfterColonMultiple('.e-addressCountry');

        let locationTypes = {
            'Physical address': 'Place',
            'Online': 'VirtualLocation',
        }

        let locations = [];

        for (let i = 0; i < location_names.length; i++) {

            loc_type = location_types[i];

            if (loc_type === 'Physical address') {
                locations.push({
                    "name": location_names[i],
                    "@type": locationTypes[loc_type],
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": location_street_addresses[i],
                        "addressLocality": location_address_localities[i],
                        "postalCode": location_postal_codes[i],
                        "addressRegion": location_address_regions[i],
                        "addressCountry": location_address_countries[i]
                    }
                });
            } else if (loc_type === 'Online') {
                locations.push({
                    "name": location_names[i],
                    "@type": locationTypes[loc_type],
                    "url": location_urls[i],
                });
            } else {
                console.log('Invalid location type');
            }
        }

        // Check if there are multiple locations
        if (location_names.length > 1) {
            // If there are multiple locations, set the locations array
            schema.location = locations;

        } else {
            // If there is only one location, set the location object
            schema.location = locations[0];
        }

        let images = getAllPNGUrls('.e-images');
        schema.image = images;


        let event_description = getDiviText('.e-description');
        schema.description = event_description;

        let offer_urls = getDiviButtonURLsMultiple('.e-offer-url');
        let offer_names = getDiviTextAfterColonMultiple('.e-offer-name');
        let offer_prices = getDiviTextAfterColonMultiple('.e-offer-price');
        let offer_currencies = getDiviTextAfterColonMultiple('.e-offer-currency');
        let offer_validFrom = getDiviTextAfterColonMultiple('.e-offer-validFrom');

        let offers = [];

        for (let i = 0; i < offer_names.length; i++) {

            offers.push({
                "@type": "Offer",
                "name": offer_names[i],
                "url": offer_urls[i],
                "price": offer_prices[i].replace(/\$/g, ''),
                "priceCurrency": offer_currencies[i],
                "availability": "https://schema.org/InStock",
                "validFrom": `${offer_validFrom[i]}T12:00`,
            });

        }

        schema.offers = offers;

        let event_organizer = {
            "@type": "Organization",
        };

        event_organizer.name = getDiviTextAfterColon('.e-organizer-name');
        event_organizer.url = getDiviTextAfterColon('.e-organizer-url');

        schema.organizer = event_organizer;

        console.log(schema);

        appendStructuredDataToHead(schema);

    }
});

