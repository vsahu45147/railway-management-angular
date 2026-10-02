# Railway Management System — Angular

A frontend-only Railway Management System built with Angular standalone components.

## Features
- Dashboard with railway statistics
- Search trains by source, destination, date, and class
- Train management: add/delete trains (stored in localStorage)
- Ticket booking with passenger details
- PNR generation
- My Bookings page with cancellation
- Station directory
- Responsive layout
- No backend required for the demo

## Run

```bash
npm install -g @angular/cli
ng new railway-management --routing --style=scss
```

Or use this project's source directly after copying it into an Angular CLI workspace.

```bash
npm install
ng serve -o
```

Open http://localhost:4200

## Data

Demo data is stored in browser localStorage under `railway-trains` and `railway-bookings`.
