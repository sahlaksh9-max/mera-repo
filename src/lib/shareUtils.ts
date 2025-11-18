/**
 * Share Utilities - Web Share API with clipboard fallback
 * 
 * This module provides sharing functionality using the Web Share API
 * on supported devices, with a clipboard fallback for others.
 */

import { toast } from "@/hooks/use-toast";

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share content using Web Share API or fallback to clipboard
 */
export async function shareContent(data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  // Try Web Share API first
  if (isWebShareSupported()) {
    try {
      await navigator.share(data);
      return true;
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        // Fall through to clipboard fallback
      } else {
        return false; // User cancelled
      }
    }
  }

  // Fallback to clipboard
  return copyToClipboard(data.url || data.text || '');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard",
        duration: 2000,
      });
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      if (successful) {
        toast({
          title: "Copied to clipboard",
          description: "Content has been copied to your clipboard",
          duration: 2000,
        });
        return true;
      }
      
      throw new Error('Copy command failed');
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    toast({
      title: "Copy failed",
      description: "Unable to copy to clipboard. Please copy manually.",
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }
}

/**
 * Share page URL
 */
export async function sharePageURL(customText?: string): Promise<boolean> {
  const url = window.location.href;
  const title = document.title;
  const text = customText || `Check out this page from Royal Academy`;

  return shareContent({ title, text, url });
}

/**
 * Share student profile
 */
export async function shareStudentProfile(studentName: string, studentId: string): Promise<boolean> {
  const url = `${window.location.origin}/student/${studentId}`;
  const text = `View ${studentName}'s profile at Royal Academy`;

  return shareContent({ title: studentName, text, url });
}

/**
 * Share event
 */
export async function shareEvent(eventTitle: string, eventId: string): Promise<boolean> {
  const url = `${window.location.origin}/events/${eventId}`;
  const text = `Join us for ${eventTitle} at Royal Academy`;

  return shareContent({ title: eventTitle, text, url });
}

/**
 * Share exam routine
 */
export async function shareExamRoutine(): Promise<boolean> {
  const url = `${window.location.origin}/exam-routine`;
  const text = `View the exam routine at Royal Academy`;

  return shareContent({ title: "Exam Routine", text, url });
}

/**
 * Share custom content with toast notification
 */
export async function shareWithToast(
  data: { title?: string; text?: string; url?: string },
  successMessage = "Content shared successfully",
  errorMessage = "Failed to share content"
): Promise<boolean> {
  const result = await shareContent(data);
  
  if (result && isWebShareSupported()) {
    toast({
      title: "Shared!",
      description: successMessage,
      duration: 2000,
    });
  }
  
  return result;
}
