type AvatarProps = {
  initials: string;
  size?: "sm" | "md";
};

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-accent flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
