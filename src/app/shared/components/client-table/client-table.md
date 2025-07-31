# Client Table Component

A reusable data table component for displaying and managing client information.

## Usage

```typescript
import { ClientTableComponent } from '@shared/components/client-table';

// In your component template
<app-client-table 
  [clients]="clientData"
  title="Client Entries"
  subtitle="Manage and track all your client interactions">
</app-client-table>
```

## Input Properties

- `title` (string): Table title (default: 'Client Entries')
- `subtitle` (string): Table subtitle (default: 'Manage and track all your client interactions')
- `exportButtonText` (string): Export button text (default: 'Export Data')
- `clients` (ClientEntry[]): Array of client data to display

## Features

- Responsive table design with horizontal scrolling
- Client avatar initials generation
- Status badges with color coding
- Currency formatting for revenue
- Action buttons for each row
- Dark mode support
- Hover effects on table rows