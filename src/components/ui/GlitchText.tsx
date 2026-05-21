import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  active?: boolean;
};

export default function GlitchText({
  children,
  active = true,
  className = "",
  ...props
}: Props) {
  return (
    <span
      className={`inline-block ${active ? "glitch" : ""} ${className}`}
      {...props}
    >
      {children}
      {active && (
        <>
          <style>{`
            .glitch {
              position: relative;
            }
            .glitch::before,
            .glitch::after {
              content: attr(data-text);
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
            .glitch::before {
              animation: glitch-shift 0.3s ease-in-out infinite alternate-reverse;
              clip-path: polygon(0 20%, 100% 20%, 100% 35%, 0 35%);
              color: #ff006e;
              z-index: -1;
            }
            .glitch::after {
              animation: glitch-shift 0.4s ease-in-out infinite alternate;
              clip-path: polygon(0 65%, 100% 65%, 100% 80%, 0 80%);
              color: #00d4ff;
              z-index: -1;
            }
            @keyframes glitch-shift {
              0% { transform: translate(0); }
              100% { transform: translate(2px, -1px); }
            }
          `}</style>
        </>
      )}
    </span>
  );
}
