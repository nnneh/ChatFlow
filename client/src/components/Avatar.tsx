import { FaUser } from "react-icons/fa6";

type Props = {
  src?: string;
  name?: string;
  size?: number;
  online?: boolean;
};

export default function Avatar({ src, name, size = 44, online }: Props) {
  const initials = name
    ?.split(/[\s_]/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt={name} className="rounded-full object-cover w-full h-full" />
      ) : (
        <div
          className="rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center font-semibold text-purple-700 w-full h-full select-none"
          style={{ fontSize: size * 0.35 }}
        >
          {initials || <FaUser size={size * 0.4} />}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${
            online ? "bg-emerald-400" : "bg-slate-300"
          }`}
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </div>
  );
}