type AvatarProps = {
  initials: string;
  size?: "sm" | "md";
};

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm"
    ? "w-8 h-8 text-xs"
    : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display font-bold text-accent flex-shrink-0`}
    >
      {initials.toUpperCase()}
    </div>
  );
}
