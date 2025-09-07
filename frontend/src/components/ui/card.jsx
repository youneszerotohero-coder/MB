import clsx from "clsx";

// Minimal Card and CardContent wrappers compatible with shadcn/ui usage in the project.
export function Card({ children, className = "", ...props }) {
  return (
    <div className={clsx("bg-white", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={clsx("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
// (Simplified JS-only Card and CardContent exported above.)
