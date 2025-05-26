import * as React from "react";

const House = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 1024 1024"
    fill="url(#houseGradient)"
    {...props}
  >
    <defs>
      <linearGradient id="houseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4f46e5" /> {/* indigo-600 */}
        <stop offset="50%" stopColor="#7c3aed" /> {/* violet-600 */}
        <stop offset="100%" stopColor="#ec4899" /> {/* pink-600 */}
      </linearGradient>
    </defs>
    <path d="M192 413.952V896h640V413.952L512 147.328 192 413.952zM139.52 374.4l352-293.312a32 32 0 0 1 40.96 0l352 293.312A32 32 0 0 1 896 398.976V928a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V398.976a32 32 0 0 1 11.52-24.576z" />
  </svg>
);

export default House;
