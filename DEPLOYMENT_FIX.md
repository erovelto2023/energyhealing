# Files to Upload to Server

## The following stub files were created locally and need to be uploaded to the server:

### Models (in lib/models/):
1. StrategyQuestion.ts
2. SearchLog.ts
3. LearningPath.ts
4. SalesPage.ts

### Components (in components/admin/):
1. NicheForm.tsx
2. HealingTermsImporter.tsx
3. HealingTermForm.tsx
4. SalesPageForm.tsx

## Quick Fix:

Run this command on the server to pull the latest changes:

```bash
git pull origin main
```

OR manually upload these 8 files to the server in their respective directories.

## Alternative: Remove the imports instead

If you don't want to upload stub files, you can remove the imports from:
- components/admin/AdminDashboard.tsx (lines 9-12)
- lib/actions.ts (lines 7-10, 14)

And comment out the sections that use these components in AdminDashboard.tsx
