// Centers its content in the viewport rather than in the space below the top
// bar: the bottom padding matches the bar's height (h-14 in topBar.tsx).
export default function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 items-center justify-center pb-14">{children}</div>;
}
