# Supabase Database Schema for Dashboard

This document outlines the database schema required for the dashboard functionality. These tables need to be created in your Supabase database for the dashboard to work with real data.

## Required Tables

### 1. clients
Stores client information and contact details.

```sql
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  status VARCHAR(50) NOT NULL CHECK (status IN ('Interested', 'Follow-up', 'Converted', 'Initial Contact', 'Not Interested')),
  last_contact VARCHAR(100) NOT NULL,
  contact_method VARCHAR(50) NOT NULL CHECK (contact_method IN ('Email', 'Phone', 'Meeting', 'LinkedIn')),
  revenue DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. dashboard_metrics
Stores various dashboard metrics and quick overview data.

```sql
CREATE TABLE dashboard_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('summary', 'recent_outreach', 'engagement_types', 'today_schedule', 'performance_metrics')),
  name VARCHAR(255) NOT NULL,
  value VARCHAR(100) NOT NULL,
  change_value VARCHAR(100),
  change_type VARCHAR(20) CHECK (change_type IN ('positive', 'negative')),
  icon TEXT,
  status VARCHAR(20) CHECK (status IN ('success', 'warning', 'danger')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. weekly_performance
Stores weekly performance data for charts.

```sql
CREATE TABLE weekly_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day VARCHAR(20) NOT NULL,
  outreach_attempts INTEGER NOT NULL DEFAULT 0,
  responses INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. client_funnel_stages
Stores funnel stage data for the client journey visualization.

```sql
CREATE TABLE client_funnel_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_name VARCHAR(100) NOT NULL,
  client_count INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
  color VARCHAR(20) NOT NULL,
  stage_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Sample Data

### Sample Clients Data
```sql
INSERT INTO clients (name, company, email, phone, status, last_contact, contact_method, revenue) VALUES
('Sarah Johnson', 'TechCorp Inc.', 'sarah.johnson@techcorp.com', '+1 (555) 123-4567', 'Interested', '2 hours ago', 'Email', 15000.00),
('Michael Chen', 'DataSystems LLC', 'm.chen@datasystems.com', '+1 (555) 987-6543', 'Follow-up', '1 day ago', 'Phone', 8500.00),
('Emily Rodriguez', 'CloudVentures', 'emily@cloudventures.io', '+1 (555) 456-7890', 'Converted', '3 days ago', 'Meeting', 25000.00),
('David Kim', 'StartupHub', 'd.kim@startuphub.com', '+1 (555) 321-0987', 'Initial Contact', '5 hours ago', 'LinkedIn', 0.00),
('Lisa Thompson', 'InnovateLab', 'lisa@innovatelab.com', '+1 (555) 654-3210', 'Interested', '6 hours ago', 'Email', 12000.00);
```

### Sample Dashboard Metrics Data
```sql
-- Summary Cards
INSERT INTO dashboard_metrics (metric_type, name, value, change_value, change_type, icon) VALUES
('summary', 'Total Clients Reached', '1,247', '+12.5% from last month', 'positive', 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'),
('summary', 'Response Rate', '34.2%', '+2.1% from last month', 'positive', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'),
('summary', 'Conversion Rate', '8.7%', '-0.3% from last month', 'negative', 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'),
('summary', 'Revenue Generated', '$24,890', '+18.2% from last month', 'positive', 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z');

-- Recent Outreach
INSERT INTO dashboard_metrics (metric_type, name, value, status) VALUES
('recent_outreach', 'Emails Sent', '157', 'success'),
('recent_outreach', 'Cold Calls', '89', 'warning'),
('recent_outreach', 'LinkedIn Messages', '34', 'success');

-- Engagement Types
INSERT INTO dashboard_metrics (metric_type, name, value) VALUES
('engagement_types', 'Email Responses', '43'),
('engagement_types', 'Phone Call-backs', '18'),
('engagement_types', 'Meeting Requests', '12');

-- Today Schedule
INSERT INTO dashboard_metrics (metric_type, name, value, status) VALUES
('today_schedule', 'Scheduled Calls', '8', 'success'),
('today_schedule', 'Follow-ups Due', '15', 'warning'),
('today_schedule', 'New Leads', '5', NULL);

-- Performance Metrics
INSERT INTO dashboard_metrics (metric_type, name, value, status) VALUES
('performance_metrics', 'Avg Response Time', '2.4h', 'success'),
('performance_metrics', 'Meeting Show Rate', '78%', 'success'),
('performance_metrics', 'Deal Close Rate', '12%', 'warning');
```

### Sample Weekly Performance Data
```sql
INSERT INTO weekly_performance (day, outreach_attempts, responses, date) VALUES
('Mon', 85, 42, CURRENT_DATE - INTERVAL '6 days'),
('Tue', 92, 58, CURRENT_DATE - INTERVAL '5 days'),
('Wed', 78, 35, CURRENT_DATE - INTERVAL '4 days'),
('Thu', 100, 67, CURRENT_DATE - INTERVAL '3 days'),
('Fri', 88, 51, CURRENT_DATE - INTERVAL '2 days'),
('Sat', 45, 18, CURRENT_DATE - INTERVAL '1 day'),
('Sun', 52, 22, CURRENT_DATE);
```

### Sample Funnel Stages Data
```sql
INSERT INTO client_funnel_stages (stage_name, client_count, percentage, color, stage_order) VALUES
('Initial Contact', 600, 48.00, '#3b82f6', 1),
('Follow-up', 413, 33.00, '#10b981', 2),
('Interested', 175, 14.00, '#f59e0b', 3),
('Converted', 63, 5.00, '#ef4444', 4);
```

## Environment Configuration

Make sure to update your environment files with your actual Supabase credentials:

### `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  supabase: {
    url: 'https://your-project-url.supabase.co',
    anonKey: 'your-anon-key-here',
  },
};
```

### `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.productiondomain.com/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  supabase: {
    url: 'https://your-production-project-url.supabase.co',
    anonKey: 'your-production-anon-key-here',
  },
};
```

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS on all tables and create appropriate policies based on your authentication requirements.

2. **API Keys**: Use environment variables for Supabase credentials and never commit actual keys to version control.

3. **Data Validation**: The database schema includes constraints, but additional validation should be implemented in the application layer.

## Testing

Before deploying to production:

1. Create the tables in your Supabase database
2. Insert sample data to test the dashboard functionality
3. Update environment files with your Supabase credentials
4. Test the dashboard to ensure data loads correctly
5. Verify error handling by temporarily using invalid credentials

## Troubleshooting

If the dashboard shows loading indefinitely or error messages:

1. Check browser console for error messages
2. Verify Supabase credentials in environment files
3. Ensure all required tables exist in your database
4. Check that the tables have data
5. Verify network connectivity to Supabase