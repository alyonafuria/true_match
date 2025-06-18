import type { SVGProps } from 'react';

export function CardanoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5" // Adjusted for better visual appearance with fill
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.368 2.053L12 5.617l5.632-3.564L12 0 .001 5.495v13.01L12 24l11.999-5.495V5.495L12 0M6.368 2.053zm11.264 0L12 5.617M.001 5.495L12 11.924l11.999-6.429M.001 5.495V18.51L12 11.924m11.999-6.429V18.51L12 11.924m0 12.076V11.924m-4.24-2.357L12 7.788l4.24 1.779-4.24 1.779zm0 0l-1.927.81v1.617l1.927.81zm0 4.398l-1.927.81v1.617l1.927.81zm8.48 0l1.927-.81V12.08l-1.927-.81zm0-4.398l1.927-.81V9.567l-1.927-.81z"/>
    </svg>
  );
}
