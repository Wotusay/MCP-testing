# Status Indicator Component

A reusable component for displaying status information with colored indicators and text.

## Usage

```html
<app-status-indicator 
  text="Development server running" 
  status="success">
</app-status-indicator>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | `''` | The status text to display |
| `status` | `StatusType` | `'success'` | The status type affecting the indicator color |

## Status Types

- `success` - Green indicator (operational/good status)
- `warning` - Yellow indicator (caution/warning state)
- `error` - Red indicator (error/failure state)
- `info` - Blue indicator (informational status)

## Examples

```html
<!-- System status indicators -->
<app-status-indicator text="API Connected" status="success"></app-status-indicator>
<app-status-indicator text="High Memory Usage" status="warning"></app-status-indicator>
<app-status-indicator text="Service Unavailable" status="error"></app-status-indicator>
<app-status-indicator text="Maintenance Mode" status="info"></app-status-indicator>
```

## Layout

- Designed for vertical stacking or grid layouts
- Consistent spacing with 12px margin-right for indicator
- Small text size (14px) optimized for status lists
- Indicators are 12x12px circular dots

## Common Use Cases

- System status dashboards
- Service health indicators  
- Build/deployment status
- Feature availability status
- Server/service monitoring
