

## Improve the Admin Dashboard with Real-Time Charts and KPIs

### Current State

The admin dashboard already has:
- **5 basic stat cards** at the top (total, pending, approved, rejected, users) -- static counters without trends
- **A "Statistiques" tab** with voting-specific KPIs and 4 charts (votes evolution, decision distribution, decision time, evaluator performance)
- **An `AdminKPIs` component** that exists but is NOT currently used in the dashboard
- **Realtime** already enabled for `applications`, `application_comments`, and `startup_notifications` tables

### What Will Be Improved

#### 1. Replace the static top-level KPI cards with enhanced animated cards
The current 5 static cards will be replaced with richer KPI cards featuring:
- Trend indicators (percentage change vs previous period, with colored arrows)
- Animated number transitions using Framer Motion
- Contextual colors (green for positive trends, red for negative)
- Micro-sparkline charts inline showing 7-day trends
- Processing time KPI (currently only in the unused `AdminKPIs` component)
- Pending documents KPI with orange alert styling (from `AdminKPIs`)

#### 2. Add a real-time overview section below KPIs
A new "Vue d'ensemble" section on the main dashboard (not buried in the Statistiques tab) with:
- **Application funnel chart**: Visual funnel showing Draft -> Submitted -> Under Review -> Approved/Rejected
- **Monthly trends bar chart**: Compact version of the monthly evolution (submitted vs approved vs rejected)
- **Status distribution donut**: Real-time pie/donut showing current status breakdown
These will be visible directly on the main dashboard, giving admins an immediate overview without navigating to the Statistiques tab.

#### 3. Real-time data refresh using Supabase Realtime
Subscribe to the `applications` table changes so that:
- KPI counters update automatically when a new application is submitted or status changes
- Charts refresh without manual "Actualiser" click
- A subtle animation plays when data updates
- The manual refresh button remains as a fallback

#### 4. Improve the existing Statistiques tab
- Add trend comparison badges to each VotingKPICard (current period vs previous period)
- Add a "Secteur" breakdown chart (horizontal bar chart showing applications by sector)
- Add a conversion funnel visualization

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/admin/EnhancedKPICards.tsx` | New animated KPI cards with trends and sparklines |
| `src/components/admin/DashboardOverview.tsx` | Overview section with funnel + mini charts |
| `src/components/admin/charts/StatusFunnelChart.tsx` | Application status funnel visualization |
| `src/components/admin/charts/SectorBreakdownChart.tsx` | Breakdown by sector chart |
| `src/hooks/useRealtimeAdminStats.ts` | Hook combining `useAdminMetrics` with realtime subscriptions |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/admin/Dashboard.tsx` | Replace static KPI cards with `EnhancedKPICards`, add `DashboardOverview` section, integrate realtime hook |
| `src/components/admin/VotingKPICards.tsx` | Add trend indicators (percentage badges with arrows) |
| `src/hooks/useAdminMetrics.ts` | Add sector breakdown data and funnel data to the metrics |

### Technical Details

**Real-time subscription** (in `useRealtimeAdminStats.ts`):
```text
supabase.channel('admin-dashboard')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, callback)
  .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluations' }, callback)
  .subscribe()
```
On each change event, the hook will re-fetch metrics and update the state with animation triggers.

**Enhanced KPI Cards** will use:
- `framer-motion` for number counting animations (AnimatedNumber component)
- Recharts `Sparkline` (tiny inline area chart) for 7-day trend visualization
- Trend calculation: compare current period metrics to the equivalent previous period

**Funnel Chart** will use Recharts `BarChart` with custom rendering to create a funnel shape showing:
- Total applications -> Submitted -> Under Review -> Decided -> Approved

**No new database tables or migrations are needed** -- all data comes from existing tables (`applications`, `evaluations`, `voting_decisions`, `document_requests`, `startups`).

The `evaluations` table needs to be added to Supabase Realtime for live KPI updates. A migration will be needed:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.evaluations;
```

