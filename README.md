# 100 Standalone React Projects

One hundred separately runnable React applications inspired by the supplied project playlist. Day 1 is `gradient-generator`; Days 2–100 are the matching `day-NN-*` folders. Each app has its own package manifest and project guide.

> **Read the scope notes:** Days 2–16 are feature-focused standalone applications. Days 17–100 combine a shared project-workspace shell with the hands-on browser demos described in their guides. These are learning projects, not production services: demos for AI, authentication, Firebase, weather, Google Calendar, or payments do not imply a live provider is connected.

## Requirements

- Node.js 20.19+ or 22.12+ (or a newer compatible release)
- npm
- A current browser; some demos need internet access or explicit browser permission, as noted in their README

## Run one app

From the selected project folder:

```sh
cd day-02-build-avatar-image-generator
npm install
npm run dev
```

Open the local URL printed by Vite. To build and preview production output, run `npm run build` and `npm run preview` in that same folder. Each project guide lists the actual scripts, implemented controls, data handling, and limitations.

## Install/build the collection

The root package declares npm workspaces for `gradient-generator` and `day-*`. From this directory:

```sh
npm install
npm run build:apps
```

The collection build runs each workspace’s declared build script when present. Apps can still be installed and run independently.

## Complete project index

| Day | Project guide | Folder | Current behavior |
| ---: | --- | --- | --- |
| 01 | [Build and Generate Unlimited Web Gradients](./gradient-generator/README.md) | `gradient-generator` | Build linear, radial, and conic CSS gradients with editable stops, motion, saved studies, and CSS export. |
| 02 | [Build Avatar Image Generator](./day-02-build-avatar-image-generator/README.md) | `day-02-build-avatar-image-generator` | Choose a palette, shape, expression, and initials; preview the SVG and download it. |
| 03 | [Build image finder from internet](./day-03-build-image-finder-from-internet/README.md) | `day-03-build-image-finder-from-internet` | Search by subject, browse thumbnails, and open the Commons page for attribution and license details. |
| 04 | [Build YouTube Thumbnail Downloader](./day-04-build-youtube-thumbnail-downloader/README.md) | `day-04-build-youtube-thumbnail-downloader` | Paste a YouTube, Shorts, embed, live, or youtu.be link; pick a size; open the image to save it. |
| 05 | [Build Zustand React Task Planner App](./day-05-build-zustand-react-task-planner-app/README.md) | `day-05-build-zustand-react-task-planner-app` | Add priorities and due dates; search and filter all/open/completed tasks; mark complete or reopen; export JSON. |
| 06 | [Build Image Storage Using Zustand](./day-06-build-image-storage-using-zustand/README.md) | `day-06-build-image-storage-using-zustand` | Import multiple images; search filenames; preview saved images; delete items. |
| 07 | [Build AI Chat Bot using React](./day-07-build-ai-chat-bot-using-react/README.md) | `day-07-build-ai-chat-bot-using-react` | Send a message about planning, focus, writing, or brainstorming; reset the conversation. |
| 08 | [Using FakerJS Build Dummy JSON Generator](./day-08-using-fakerjs-build-dummy-json-generator/README.md) | `day-08-using-fakerjs-build-dummy-json-generator` | Edit field names/types, add or remove fields, choose a record count, generate, copy, and download JSON. |
| 09 | [Build QR Code Generator in React](./day-09-build-qr-code-generator-in-react/README.md) | `day-09-build-qr-code-generator-in-react` | Edit content, inspect the live matrix, and download SVG. |
| 10 | [Build Expense Tracker using Zustand CRUD](./day-10-build-expense-tracker-using-zustand-crud/README.md) | `day-10-build-expense-tracker-using-zustand-crud` | Add dated amounts; filter month/category; inspect totals; export the visible month as CSV. |
| 11 | [Build Canvas Image Resizer in React](./day-11-build-canvas-image-resizer-in-react/README.md) | `day-11-build-canvas-image-resizer-in-react` | Choose/drop an image; enter dimensions; lock aspect ratio; select JPEG/PNG; adjust JPEG quality; download. |
| 12 | [Size Finder App in React](./day-12-size-finder-app-in-react/README.md) | `day-12-size-finder-app-in-react` | Choose Women/Men/Unisex, cm/inches, fit ease, and chest/waist/hip measurements; inspect recommendation and chart. |
| 13 | [Build notebook app using react](./day-13-build-notebook-app-using-react/README.md) | `day-13-build-notebook-app-using-react` | Create, search, edit/autosave, pin, export as Markdown, and delete notes. |
| 14 | [Build Strong Password Generator App](./day-14-build-strong-password-generator-app/README.md) | `day-14-build-strong-password-generator-app` | Choose character groups and length; omit look-alikes; generate and copy; review estimated entropy. |
| 15 | [Build Export to CSV in React](./day-15-build-export-to-csv-in-react/README.md) | `day-15-build-export-to-csv-in-react` | Edit cells/headings; add/remove rows and columns; import CSV; inspect, copy, or download escaped CSV. |
| 16 | [React Visiting Card Generator](./day-16-react-visiting-card-generator/README.md) | `day-16-react-visiting-card-generator` | Edit contact details; select a theme; preview SVG; download or print. |
| 17 | [React AI Project Language Translator](./day-17-react-ai-project-language-translator/README.md) | `day-17-react-ai-project-language-translator` | Enter text; choose Spanish, French, or Urdu; request a preview. |
| 18 | [Build Video Player in React](./day-18-build-video-player-in-react/README.md) | `day-18-build-video-player-in-react` | Choose a local video and play, pause, seek, or adjust volume. |
| 19 | [Build React Photo Editor](./day-19-build-react-photo-editor/README.md) | `day-19-build-react-photo-editor` | Choose an image; adjust brightness and saturation; reset both. |
| 20 | [React Password Protected Contact App](./day-20-react-password-protected-contact-app/README.md) | `day-20-react-password-protected-contact-app` | Enter the displayed PIN (2468); add or remove contacts. |
| 21 | [Export Table to PDF in React](./day-21-export-table-to-pdf-in-react/README.md) | `day-21-export-table-to-pdf-in-react` | Review illustrative rows and total; download a PDF generated in the browser. |
| 22 | [React Attendance Tracker App](./day-22-react-attendance-tracker-app/README.md) | `day-22-react-attendance-tracker-app` | Toggle present/not marked and review the count. |
| 23 | [React AI Diet Planner](./day-23-react-ai-diet-planner/README.md) | `day-23-react-ai-diet-planner` | Add a meal and estimated calories; review the sum. |
| 24 | [React Emoji Finder App](./day-24-react-emoji-finder-app/README.md) | `day-24-react-emoji-finder-app` | Filter sample emoji by keyword and copy a selected character. |
| 25 | [React Playlist Manager](./day-25-react-playlist-manager/README.md) | `day-25-react-playlist-manager` | Choose tracks and use native audio playback controls. |
| 26 | [Build React World`s Timer](./day-26-build-react-world-s-timer/README.md) | `day-26-build-react-world-s-timer` | View updating times, dates, and timezone labels. |
| 27 | [Build Book Library Reading Tracker](./day-27-build-book-library-reading-tracker/README.md) | `day-27-build-book-library-reading-tracker` | Add, search, complete, remove, and export entries as JSON. |
| 28 | [React Bookmark Manager](./day-28-react-bookmark-manager/README.md) | `day-28-react-bookmark-manager` | Add, search, complete, remove, and export entries. |
| 29 | [React Country Code Mobile Phone Input](./day-29-react-country-code-mobile-phone-input/README.md) | `day-29-react-country-code-mobile-phone-input` | Choose US, UK, Pakistan, India, or UAE code and enter a number. |
| 30 | [Build React Music Player](./day-30-build-react-music-player/README.md) | `day-30-build-react-music-player` | Choose multiple tracks and use native audio controls. |
| 31 | [Build Pomodoro App in React](./day-31-build-pomodoro-app-in-react/README.md) | `day-31-build-pomodoro-app-in-react` | Start/pause, set a duration, and reset. |
| 32 | [Build Remember Me Login Form in React](./day-32-build-remember-me-login-form-in-react/README.md) | `day-32-build-remember-me-login-form-in-react` | Enter a sample email, choose a role, preview the signed-in state, and sign out. |
| 33 | [Admin Panel Layout Responsive React](./day-33-admin-panel-layout-responsive-react/README.md) | `day-33-admin-panel-layout-responsive-react` | Use local entry create/search/complete/remove/export plus workspace, library, and about panels. |
| 34 | [Bar Code Generator React](./day-34-bar-code-generator-react/README.md) | `day-34-bar-code-generator-react` | Enter short content and inspect an SVG preview. |
| 35 | [React Reusable Shared Component](./day-35-react-reusable-shared-component/README.md) | `day-35-react-reusable-shared-component` | Try buttons, edit an input, inspect a status badge/card, and save a sample. |
| 36 | [React 19 Ant Design Tutorial](./day-36-react-19-ant-design-tutorial/README.md) | `day-36-react-19-ant-design-tutorial` | Try buttons, edit an input, inspect a badge/card, and save a sample. |
| 37 | [React Web Scraping](./day-37-react-web-scraping/README.md) | `day-37-react-web-scraping` | Parse headings, paragraphs, and links from a supplied HTML string. |
| 38 | [Create Dynamic Input Field in React](./day-38-create-dynamic-input-field-in-react/README.md) | `day-38-create-dynamic-input-field-in-react` | Enter a label, choose Text/Email/Number, add a field, and remove it. |
| 39 | [React Http Client App](./day-39-react-http-client-app/README.md) | `day-39-react-http-client-app` | Choose GET/POST, edit an HTTP(S) URL, and inspect status and bounded response text/JSON. |
| 40 | [Dynamic Payload & Header Http Request](./day-40-dynamic-payload-and-header-http-request/README.md) | `day-40-dynamic-payload-and-header-http-request` | Choose GET/POST, enter an HTTP(S) endpoint, send the built-in request, and inspect response. |
| 41 | [Production Grade Http Request Handling](./day-41-production-grade-http-request-handling/README.md) | `day-41-production-grade-http-request-handling` | Choose GET/POST, enter URL, send, and inspect status/body. |
| 42 | [Redux & Redux Toolkit Tutorial](./day-42-redux-and-redux-toolkit-tutorial/README.md) | `day-42-redux-and-redux-toolkit-tutorial` | Increment, decrement, reset, and inspect the state value. |
| 43 | [Start Building Ecommerce Project](./day-43-start-building-ecommerce-project/README.md) | `day-43-start-building-ecommerce-project` | Add the single sample product; review cart quantity, demo total, and simulated checkout. |
| 44 | [Ecommerce Project \| Formik Yup Validation](./day-44-ecommerce-project-formik-yup-validation/README.md) | `day-44-ecommerce-project-formik-yup-validation` | Add the sample product and inspect demo checkout feedback. |
| 45 | [Admin Authentication using Zustand](./day-45-admin-authentication-using-zustand/README.md) | `day-45-admin-authentication-using-zustand` | Choose a demo role, enter a sample email, and preview access feedback. |
| 46 | [Auth Guard Protect Admin Pages Ecommerce](./day-46-auth-guard-protect-admin-pages-ecommerce/README.md) | `day-46-auth-guard-protect-admin-pages-ecommerce` | Add the sample product to the demo cart and simulate checkout. |
| 47 | [Ecommerce Admin Layout](./day-47-ecommerce-admin-layout/README.md) | `day-47-ecommerce-admin-layout` | Use the sample product and cart demonstration. |
| 48 | [Role Based Authentication](./day-48-role-based-authentication/README.md) | `day-48-role-based-authentication` | Choose Member/Administrator and enter a sample email. |
| 49 | [Role Protect Admin & User Panel](./day-49-role-protect-admin-and-user-panel/README.md) | `day-49-role-protect-admin-and-user-panel` | Select a role and inspect local access feedback. |
| 50 | [Changing user roles to Admin](./day-50-changing-user-roles-to-admin/README.md) | `day-50-changing-user-roles-to-admin` | Select a demo role and inspect the access message. |
| 51 | [Ecommerce Admin Panel Product](./day-51-ecommerce-admin-panel-product/README.md) | `day-51-ecommerce-admin-panel-product` | Add the single sample item and inspect cart quantity/checkout feedback. |
| 52 | [Http Interceptor & useEffect Live update](./day-52-http-interceptor-and-useeffect-live-update/README.md) | `day-52-http-interceptor-and-useeffect-live-update` | Choose GET/POST, enter an HTTP(S) URL, send fixed demo payload, inspect response/error. |
| 53 | [Edit & Update Product in React](./day-53-edit-and-update-product-in-react/README.md) | `day-53-edit-and-update-product-in-react` | Add the sample item to cart and inspect quantity/checkout feedback. |
| 54 | [Update User Profile Address & Password](./day-54-update-user-profile-address-and-password/README.md) | `day-54-update-user-profile-address-and-password` | Add, search, complete, remove, and export entries. |
| 55 | [Add to Cart in Ecommerce](./day-55-add-to-cart-in-ecommerce/README.md) | `day-55-add-to-cart-in-ecommerce` | Add the featured product and inspect in-memory quantity and total. |
| 56 | [Stripe Payment Gateway & Webhook Tutorial](./day-56-stripe-payment-gateway-and-webhook-tutorial/README.md) | `day-56-stripe-payment-gateway-and-webhook-tutorial` | Review the fixed demo order and simulate a successful checkout. |
| 57 | [Ecommerce Cart Counter](./day-57-ecommerce-cart-counter/README.md) | `day-57-ecommerce-cart-counter` | Add the sample product and review quantity/total. |
| 58 | [Ecommerce Checkout and Payment Gteway](./day-58-ecommerce-checkout-and-payment-gteway/README.md) | `day-58-ecommerce-checkout-and-payment-gteway` | Add the sample item and simulate checkout feedback. |
| 59 | [Ecommerce Dispatch Product](./day-59-ecommerce-dispatch-product/README.md) | `day-59-ecommerce-dispatch-product` | Select timeline steps and inspect completed/current/upcoming states. |
| 60 | [Ecommerce Order Dispatched Notification](./day-60-ecommerce-order-dispatched-notification/README.md) | `day-60-ecommerce-order-dispatched-notification` | Change the sample status and inspect journey progress. |
| 61 | [Build Sticky Notes App in React](./day-61-build-sticky-notes-app-in-react/README.md) | `day-61-build-sticky-notes-app-in-react` | Edit text, save an entry, and remove notes. |
| 62 | [Build React Keyboard Keys Highlighter App](./day-62-build-react-keyboard-keys-highlighter-app/README.md) | `day-62-build-react-keyboard-keys-highlighter-app` | Press keys and inspect the recent-key list and key map. |
| 63 | [Build Custom Text File Editor](./day-63-build-custom-text-file-editor/README.md) | `day-63-build-custom-text-file-editor` | Write text, save snippets, and remove them. |
| 64 | [E-Commerce Delivery Timeline Design](./day-64-e-commerce-delivery-timeline-design/README.md) | `day-64-e-commerce-delivery-timeline-design` | Choose a status and inspect completed/current/upcoming steps. |
| 65 | [React IndexedDB Offline Storage Tutorial](./day-65-react-indexeddb-offline-storage-tutorial/README.md) | `day-65-react-indexeddb-offline-storage-tutorial` | Edit text, save it locally, and load the saved record. |
| 66 | [React Debouncing Optimized Search](./day-66-react-debouncing-optimized-search/README.md) | `day-66-react-debouncing-optimized-search` | Type a phrase and inspect matching results after 250 ms. |
| 67 | [Build Audio Library IndexedDB React](./day-67-build-audio-library-indexeddb-react/README.md) | `day-67-build-audio-library-indexeddb-react` | Choose files and use the native audio players. |
| 68 | [Image Masonry Layout in React](./day-68-image-masonry-layout-in-react/README.md) | `day-68-image-masonry-layout-in-react` | Inspect six labeled color tiles as the viewport changes. |
| 69 | [React Keyboard Controlled Image Slideshow](./day-69-react-keyboard-controlled-image-slideshow/README.md) | `day-69-react-keyboard-controlled-image-slideshow` | Use the on-screen previous/next controls. |
| 70 | [Build Alarm & Reminder App in React](./day-70-build-alarm-and-reminder-app-in-react/README.md) | `day-70-build-alarm-and-reminder-app-in-react` | Choose 1–240 minutes, schedule a reminder, and optionally request notification permission. |
| 71 | [Building React URL Parser App](./day-71-building-react-url-parser-app/README.md) | `day-71-building-react-url-parser-app` | Inspect protocol, hostname, port, path, query parameters, and fragment. |
| 72 | [Building React Modern Calculator App](./day-72-building-react-modern-calculator-app/README.md) | `day-72-building-react-modern-calculator-app` | Use keypad or expression input for +, −, ×, ÷; evaluate or clear. |
| 73 | [React Product Tour UI](./day-73-react-product-tour-ui/README.md) | `day-73-react-product-tour-ui` | Use Next/Back and restart to explore sample guidance. |
| 74 | [React Invoice App with PDF & Print](./day-74-react-invoice-app-with-pdf-and-print/README.md) | `day-74-react-invoice-app-with-pdf-and-print` | Inspect illustrative rows and total; download locally generated PDF. |
| 75 | [Build Live Weather App in React](./day-75-build-live-weather-app-in-react/README.md) | `day-75-build-live-weather-app-in-react` | Enter a city and inspect the sample weather card. |
| 76 | [Build Quiz App Using AI](./day-76-build-quiz-app-using-ai/README.md) | `day-76-build-quiz-app-using-ai` | Answer three multiple-choice questions; review feedback/score; finish or restart. |
| 77 | [Design Star Review Rating UI in React](./day-77-design-star-review-rating-ui-in-react/README.md) | `day-77-design-star-review-rating-ui-in-react` | Select 1–5 stars, add optional feedback, and review the entry. |
| 78 | [Buid React IMage Converter JPG PNG WEBP](./day-78-buid-react-image-converter-jpg-png-webp/README.md) | `day-78-buid-react-image-converter-jpg-png-webp` | Choose image, output width, and JPEG/PNG/WebP; process and download. |
| 79 | [Build React Multiple Image to PDF](./day-79-build-react-multiple-image-to-pdf/README.md) | `day-79-build-react-multiple-image-to-pdf` | Choose ordered images, remove selections, and export one image per page. |
| 80 | [Build React Passport Size Image Maker App](./day-80-build-react-passport-size-image-maker-app/README.md) | `day-80-build-react-passport-size-image-maker-app` | Choose image, output width, and format; download the proportional result. |
| 81 | [React Schedule Meeting On Google Calendar](./day-81-react-schedule-meeting-on-google-calendar/README.md) | `day-81-react-schedule-meeting-on-google-calendar` | Enter a meeting title/start time and download a one-hour .ics event. |
| 82 | [Read & Export Text to PDF in React](./day-82-read-and-export-text-to-pdf-in-react/README.md) | `day-82-read-and-export-text-to-pdf-in-react` | Enter or paste text and generate a PDF with page continuation. |
| 83 | [React Firebase Authentication Tutorial](./day-83-react-firebase-authentication-tutorial/README.md) | `day-83-react-firebase-authentication-tutorial` | Choose a demo role and sample email to view access feedback. |
| 84 | [Merge Combined PDF in React](./day-84-merge-combined-pdf-in-react/README.md) | `day-84-merge-combined-pdf-in-react` | Choose PDFs, reorder upward, remove files, merge, and download. |
| 85 | [Resize image in React](./day-85-resize-image-in-react/README.md) | `day-85-resize-image-in-react` | Choose image, output width, JPEG/PNG/WebP, and download. |
| 86 | [Login with Google Firebase in React](./day-86-login-with-google-firebase-in-react/README.md) | `day-86-login-with-google-firebase-in-react` | Choose a demo role and sample email to preview access. |
| 87 | [Search Mark in React](./day-87-search-mark-in-react/README.md) | `day-87-search-mark-in-react` | Type a query and inspect highlighted results in the built-in list. |
| 88 | [File Rename App in React](./day-88-file-rename-app-in-react/README.md) | `day-88-file-rename-app-in-react` | Choose one file, inspect its details, and preview it if it is an image. |
| 89 | [React Password Strength Checker](./day-89-react-password-strength-checker/README.md) | `day-89-react-password-strength-checker` | Enter a test value and inspect the length/character-variety indicator. |
| 90 | [Firebase Crud in React using Firestore](./day-90-firebase-crud-in-react-using-firestore/README.md) | `day-90-firebase-crud-in-react-using-firestore` | Add, search, complete, remove, and export entries as JSON. |
| 91 | [Generate Image from Video Frames](./day-91-generate-image-from-video-frames/README.md) | `day-91-generate-image-from-video-frames` | Choose a video, seek with native controls, and save the current frame as PNG. |
| 92 | [Screen Recording in React](./day-92-screen-recording-in-react/README.md) | `day-92-screen-recording-in-react` | Choose a screen/window and stop the stream to release capture tracks. |
| 93 | [Build React App to Compress Image](./day-93-build-react-app-to-compress-image/README.md) | `day-93-build-react-app-to-compress-image` | Choose image, output width and JPEG/PNG/WebP, then download. |
| 94 | [React Intersection Observer](./day-94-react-intersection-observer/README.md) | `day-94-react-intersection-observer` | Scroll the sample list and inspect in-view/out-of-view states. |
| 95 | [Build Camera App in React](./day-95-build-camera-app-in-react/README.md) | `day-95-build-camera-app-in-react` | Enable camera, inspect live preview, and stop to release tracks. |
| 96 | [Build Store Room App in React](./day-96-build-store-room-app-in-react/README.md) | `day-96-build-store-room-app-in-react` | Add, search, complete, remove, and export JSON entries. |
| 97 | [React JSZip Tutorial](./day-97-react-jszip-tutorial/README.md) | `day-97-react-jszip-tutorial` | Choose multiple files, inspect selection, and create/download a ZIP in the browser. |
| 98 | [React Country State City Dynamic Selector](./day-98-react-country-state-city-dynamic-selector/README.md) | `day-98-react-country-state-city-dynamic-selector` | Select Pakistan, India, or Canada, then choose an available region and city. |
| 99 | [React Private Image Gallery](./day-99-react-private-image-gallery/README.md) | `day-99-react-private-image-gallery` | Choose a file, inspect its details, and preview it locally if it is an image. |
| 100 | [Course Ending](./day-100-course-ending/README.md) | `day-100-course-ending` | Grant microphone permission; start/stop; play or download the WebM recording. |

## Architecture, privacy, and limitations

- Every app is a separate React/Vite project; no app imports runtime code from a neighboring day. The root workspace is an install/build convenience.
- Local data lives in browser localStorage, IndexedDB, or page memory as each project guide specifies. It is not automatically backed up, encrypted, or synchronized.
- Image/audio/video/PDF/ZIP processing and previews are local where documented. Large files can consume substantial browser memory.
- Network examples need connectivity and can be blocked by upstream availability or browser CORS. Camera, screen, microphone, clipboard, and notification features require browser support and explicit permission.
- Demo login, PIN, and role controls are not security boundaries. Storefront checkout and the payment sandbox never collect card details or charge money. No production credentials are included.

## Troubleshooting

- Use a compatible Node.js version and run `npm install` from the collection root or a project folder.
- For a browser API, try a current browser on localhost/HTTPS and grant permission only if you choose to use it.
- If an API request fails, check connectivity and CORS support; the target service may block browser calls.
- Browser storage can be cleared by the browser or unavailable in private mode. Export backups when a project offers that option.

## License and attribution

No repository-wide license is declared. Until one is added, do not assume the code is licensed for reuse. Follow the license, attribution, and terms of any third-party media or service used by a project.
