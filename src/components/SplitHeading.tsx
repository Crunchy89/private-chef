type SplitHeadingProps = {
  lead: string;
  rest: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** dark = cream rest (for dark section backgrounds) */
  tone?: "light" | "dark";
};

/** Candlelight split: flame-gold lead, warm espresso (or cream on dark) for the rest */
export function SplitHeading({
  lead,
  rest,
  as: Tag = "h2",
  className = "",
  tone = "light",
}: SplitHeadingProps) {
  const restColor = tone === "dark" ? "text-cream" : "text-ink";

  return (
    <Tag className={`font-display tracking-tight ${restColor} ${className}`}>
      <span className="text-candle">{lead}</span>
      {rest ? <> {rest}</> : null}
    </Tag>
  );
}
