import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || 32}
      height={props.height || 32}
      {...props}
    >
      <g fill="hsl(var(--primary))">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M152 96a24 24 0 1 1-24-24a24 24 0 0 1 24 24Zm-24-8a8 8 0 1 0-8 8a8 8 0 0 0 8-8Z" />
        <path d="M184 128a56 56 0 0 1-56 56h-2.3a8 8 0 0 1 0-16H128a40 40 0 0 0 0-80h-48a8 8 0 0 1 0-16h48a56 56 0 0 1 56 56Z" />
      </g>
    </svg>
  );
}
