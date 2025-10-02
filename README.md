# Google Event Schema Script

This JS script automatically generates and appends [Google Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event) (`application/ld+json`) to the `<head>` of pages that feature event information in order increase SEO effectiveness and provide rich search result enhancements. 

I originally wrote this for a website that used the Divi Wordpress theme, however it can be adapted for any HTML page.

**You are most welcome to use this code in your commercial projects, all that I ask in return is that you credit my work by providing a link back to this repository. Thank you & Enjoy!**

## Features

- **Automatic detection**: Runs only on event pages (checks for `.e-name`).
- **Schema.org compliant**: Generates JSON-LD structured data for events.
- **Supports multiple 'locations'**: Handles both physical and online events.
- **Supports multiple offers**: Extracts ticket/offer details including price, currency, and validity.
- **Handles images**: Collects `.png` images for event schema.
- **Organizer details**: Adds organizer name and URL.
- **Time zone aware**: Builds proper ISO 8601 start and end times with offset.

## How It Works

1. Waits for the `DOMContentLoaded` event.
2. Checks if `.e-name` exists to confirm it’s an event page.
3. Extracts event details from Divi classes:
   - **Name**: `.e-name`
   - **Dates/Times**: `.e-start-date`, `.e-start-time`, `.e-end-date`, `.e-end-time`, `.e-timezone-offset`
   - **Attendance Mode**: `.e-event-attendance-mode` (`Offline`, `Online`, or `Offline and Online`)
   - **Locations**: `.e-location-name`, `.e-location-type`, `.e-streetAddress`, `.e-addressLocality`, `.e-postalCode`, `.e-addressRegion`, `.e-addressCountry`
   - **Images**: `.e-images`
   - **Description**: `.e-description`
   - **Offers**: `.e-offer-name`, `.e-offer-price`, `.e-offer-currency`, `.e-offer-validFrom`, `.e-offer-url`
   - **Organizer**: `.e-organizer-name`, `.e-organizer-url`
4. Builds a JSON-LD schema object.
5. Injects it into the `<head>` of the document for Google to crawl.

---

## Example Generated Schema

```json
{
   "@context": "https://schema.org",
   "@type": "Event",
   "name": "Sample Event",
   "startDate": "2025-07-21T19:00-05:00",
   "endDate": "2025-07-21T22:00-05:00",
   "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
   "eventStatus": "https://schema.org/EventScheduled",
   "location": {
      "@type": "Place",
      "name": "Sample Venue",
      "address": {
         "@type": "PostalAddress",
         "streetAddress": "123 Main St",
         "addressLocality": "New York",
         "postalCode": "10001",
         "addressRegion": "NY",
         "addressCountry": "US"
      }
   },
   "image": ["https://example.com/event-image.png"],
   "description": "This is a sample event description.",
   "offers": [
      {
         "@type": "Offer",
         "name": "General Admission",
         "url": "https://example.com/tickets",
         "price": "50",
         "priceCurrency": "USD",
         "availability": "https://schema.org/InStock",
         "validFrom": "2025-05-01T12:00"
      }
   ],
   "organizer": {
      "@type": "Organization",
      "name": "Event Organizer Inc.",
      "url": "https://organizer.com"
   }
}
```

## Installation

import the script into the header/footer of your HTML page.



