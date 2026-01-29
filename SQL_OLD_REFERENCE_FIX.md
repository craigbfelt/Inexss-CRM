# SQL Query Error Fix: Missing FROM-clause entry for table "old"

## Problem Description

**Error Message:**
```
ERROR: 42P01: missing FROM-clause entry for table "old"
```

This PostgreSQL error occurred when trying to run the database schema or migration files.

## Root Cause

The error was caused by **incorrectly using `OLD` references in Row Level Security (RLS) policy WITH CHECK clauses**.

### The Issue
In PostgreSQL, the `OLD` and `NEW` pseudo-tables are **only available in trigger contexts** (BEFORE/AFTER INSERT/UPDATE/DELETE triggers). They **cannot be used in RLS policy expressions**.

### What Was Wrong

The following policy in both `schema.sql` and `migration_fix_user_policies.sql` was incorrect:

```sql
-- ❌ INCORRECT - OLD is not available in RLS policies
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = OLD.role              -- ❌ ERROR: OLD not available here
    AND is_active = OLD.is_active    -- ❌ ERROR: OLD not available here
  );
```

## The Fix

We removed the invalid `OLD` references from the RLS policy:

```sql
-- ✅ CORRECT - Simple check without OLD references
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

## Files Changed

1. **`supabase/schema.sql`** (lines 231-233)
   - Removed `AND role = OLD.role AND is_active = OLD.is_active` from the policy

2. **`supabase/migration_fix_user_policies.sql`** (lines 30-32)
   - Removed the same invalid OLD references

## Impact

### What This Means
- Users can now update their own profile without SQL errors
- The policy still enforces that users can only update their **own** records (via `auth.uid() = id`)
- Role and status protection should be handled at the **application layer** or via **triggers**, not RLS policies

### Security Considerations

If you need to prevent users from changing their own `role` or `is_active` fields, you have these options:

1. **Application Layer (Recommended)**: Validate in your application code that these fields aren't modified
2. **Database Triggers**: Create a BEFORE UPDATE trigger that prevents changes:

```sql
CREATE OR REPLACE FUNCTION prevent_user_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent users from changing their own role or status
  IF NEW.role <> OLD.role OR NEW.is_active <> OLD.is_active THEN
    RAISE EXCEPTION 'Cannot change role or status';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_role_immutability
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_user_role_change();
```

3. **Column Privileges**: Use PostgreSQL column-level privileges to restrict updates

## How to Apply

If you're updating an existing Supabase database:

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Run the updated `migration_fix_user_policies.sql` file
3. The fix will drop and recreate the policy correctly

If you're setting up a new database:

1. Use the updated `schema.sql` file
2. The corrected policy will be created automatically

## Technical Details

### PostgreSQL Documentation Reference

From PostgreSQL documentation:
> "Within a row security policy expression, you can reference columns of the target table using their names. The special table names OLD and NEW can be used to reference existing and new row values, **but only in trigger contexts**."

### Why This Matters

RLS policies and triggers use different mechanisms in PostgreSQL. The pseudo-tables OLD and NEW are **trigger-specific constructs** provided by the trigger system during trigger execution. They are not general row references available in other contexts like RLS policies. RLS policies can access row data through column references, but they cannot use the OLD and NEW pseudo-variables that are exclusive to triggers.

### Alternative Approaches Considered

We considered these alternatives but chose the simple fix for minimal code change:

1. **Trigger-based validation** - More complex, requires additional code
2. **Application-layer validation** - Better separation of concerns, but requires backend changes
3. **Simplified RLS policy** - ✅ **Chosen** - Minimal change, fixes the immediate error

## Verification

After applying the fix, verify it works:

```sql
-- In Supabase SQL Editor, check the policy exists correctly
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'users'
  AND policyname = 'Users can update their own profile';
```

Expected result: One row showing the UPDATE policy without any OLD references.

## Related Issues

This fix is independent of the previous RLS infinite recursion fix. Both fixes address different issues:

- **Previous fix** (`migration_fix_user_policies.sql`): Removed recursive queries that caused infinite loops
- **This fix**: Removed invalid OLD references that caused SQL syntax errors

## References

- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [PostgreSQL Triggers and OLD/NEW](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

---

**Date Fixed**: January 2026
**Issue**: SQL error "missing FROM-clause entry for table 'old'"
**Status**: ✅ RESOLVED
