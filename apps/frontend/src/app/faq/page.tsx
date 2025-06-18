"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page can redirect to the Help page's FAQ section or be a standalone FAQ page.
// For simplicity, this example will redirect. If a separate page is desired,
// structure it similarly to HelpPage but focused only on FAQs.

export default function FAQPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Help page, assuming FAQs are there or a section can be scrolled to.
    // For a real SPA-like scroll, you'd need more logic or ensure /help page handles hash.
    router.replace('/help#faq-section'); // Assuming #faq-section ID exists on help page.
                                        // For this example, it will just go to /help.
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting to our Help & FAQ page...</p>
    </div>
  );
}
