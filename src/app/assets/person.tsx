import * as React from "react";

const Person = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    stroke="url(#personGradient)"
    strokeWidth={3}
    viewBox="0 0 64 64"
    {...props}
  >
    <defs>
      <linearGradient id="personGradient" x1="10%" y1="0%" x2="100%" y2="20%">
        <stop offset="0%" stopColor="#4f46e5" /> {/* indigo-600 */}
        <stop offset="50%" stopColor="#7c3aed" /> {/* violet-600 */}
        <stop offset="100%" stopColor="#ec4899" /> {/* pink-600 */}
      </linearGradient>
    </defs>
    <circle cx={32} cy={18.14} r={11.14} />
    <path d="M54.55 56.85A22.55 22.55 0 0 0 32 34.3 22.55 22.55 0 0 0 9.45 56.85Z" />
  </svg>
);

export default Person;
