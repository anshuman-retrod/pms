# RBAC Baseline: Current Flow and Admin Touchpoints

## Source of Truth

- Static role-to-permission mapping lives in `src/features/auth/lib/rbac.ts`.
- `ALL_PERMISSIONS`, `ROLE_PERMISSIONS`, and `hasPermission()` define effective role capabilities.
- `ROLE_LABEL` and `ROLE_DESCRIPTION` provide human-readable role context for UI surfaces.

## Runtime Permission Evaluation

- `AuthProvider` in `src/features/auth/providers/AuthProvider.tsx` exposes `can(permission)` for access checks.
- `can()` is used by feature pages and navigation to determine manage/view capability.
- Session user state and user list are persisted in local storage (`retrod.auth.user`, `retrod.auth.users`).

## Navigation + Feature Gating

- Sidebar route visibility uses nav metadata and role permission checks.
- Tenant-feature visibility is an independent layer handled by entitlement checks (`featureEnabled`) from `AuthProvider`.
- Root route gate (`src/routes/__root.tsx`) blocks disabled tenant features and renders a disabled-state screen.

## Admin UX Touchpoints (Current Product)

- `src/features/settings/components/UsersFeature.tsx`: invite users, assign role, enable/disable, delete users.
- `src/features/settings/components/RolesFeature.tsx`: read-only permission matrix and role summaries.
- `src/features/onboarding/components/StaffStep.tsx`: onboarding invites with role assignment.
- `src/features/settings/components/AuditFeature.tsx`: admin and operational event timeline.

## Key Friction (As-Is)

- Users, Roles, and onboarding role assignment are distributed across separate surfaces.
- Route-level hard guard coverage for admin pages was not consistently enforced by URL access.
- Action confirmation and feedback patterns were inconsistent across user management flows.
- Mobile users list had reduced management parity compared with desktop.

## Implementation Notes for This RBAC UX Plan

- Keep static RBAC model intact (no dynamic permission editor in this phase).
- Improve usability by connecting role context directly to user actions.
- Add explicit route guards for admin routes to complement sidebar visibility filtering.
- Add audit event capture for user/role/admin-affecting actions and entitlement updates.
