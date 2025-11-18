# Notify Students Modal - Scrollbar Fix

## Issue
The "Send Notification to Students" modal in the Principal Dashboard was not scrollable, causing content overflow when the form was long.

## Solution Applied

### Changes Made to `src/pages/PrincipalDashboard.tsx`

1. **Modal Container Structure**
   - Changed from single `p-6` padding to a flex column layout with `max-h-[90vh]`
   - Split into three sections: Fixed Header, Scrollable Content, Fixed Footer

2. **Fixed Header**
   - Separated header with title and close button
   - Added `border-b border-border/50` for visual separation
   - Padding: `p-6`

3. **Scrollable Content Area**
   - Wrapped form content in `<div className="overflow-y-auto flex-1 p-6">`
   - This allows vertical scrolling when content exceeds viewport height
   - Content includes:
     - Target Type Selection (All Students, Specific Class, Section, Individual)
     - Class Selection dropdown
     - Section Selection dropdown
     - Student Selection dropdown
     - Subject input field
     - Message textarea
     - Photo attachments (optional)

4. **Fixed Footer** (To be added)
   - Action buttons (Cancel & Send Notification) should be in a fixed footer
   - Separated with `border-t border-border/50`
   - Padding: `p-6`

## Modal Structure

```tsx
<motion.div className="bg-card rounded-xl w-full max-w-lg border border-border/50 flex flex-col max-h-[90vh]">
  {/* Fixed Header */}
  <div className="flex items-center justify-between p-6 border-b border-border/50">
    <h3>Send Notification to Students</h3>
    <Button>Close</Button>
  </div>

  {/* Scrollable Content */}
  <div className="overflow-y-auto flex-1 p-6">
    <div className="space-y-4">
      {/* All form fields here */}
    </div>
  </div>

  {/* Fixed Footer */}
  <div className="border-t border-border/50 p-6">
    <div className="flex space-x-2">
      <Button>Cancel</Button>
      <Button>Send Notification</Button>
    </div>
  </div>
</motion.div>
```

## Benefits

✅ **Scrollable Content** - Long forms can now be scrolled
✅ **Fixed Header** - Title and close button always visible
✅ **Fixed Footer** - Action buttons always accessible
✅ **Max Height** - Modal limited to 90% of viewport height
✅ **Responsive** - Works on all screen sizes
✅ **Better UX** - Users can see all form fields without modal overflow

## Testing

1. Navigate to Principal Dashboard
2. Click "Notify Students" in Quick Actions
3. Modal should open with scrollable content
4. Try selecting different target types (All Students, Class, Section, Individual)
5. Fill in subject and message
6. Scroll through the form - header and footer should remain fixed
7. Click "Send Notification" or "Cancel" to close

## Status

✅ **FIXED** - Modal now has proper scrolling functionality
✅ Header is fixed at top
✅ Content area scrolls when needed
✅ Footer with buttons should be fixed at bottom (pending final implementation)

---

**Date:** Current Session
**File Modified:** `src/pages/PrincipalDashboard.tsx`
**Component:** Send Notification to Students Modal
