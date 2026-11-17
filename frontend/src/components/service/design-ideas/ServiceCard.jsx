import Image from "next/image";
import Link from "next/link";
import {
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Armchair,
  Lamp,
  Layers,
  Ruler,
  Palette,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

// Matches the ids used in Services.jsx. Unknown ids fall back to Sparkles.
const icons = {
  "living-spaces": Sofa,
  "bedroom-sanctuaries": BedDouble,
  "kitchen-dining": UtensilsCrossed,
  "bespoke-furniture": Armchair,
  "lighting-design": Lamp,
  "material-sourcing": Layers,
  "space-planning": Ruler,
  "color-consultation": Palette,
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8972B]";

// Hover reveal:
// - On devices with a mouse (hover: hover) the title + description are hidden and
//   slide in when the card is hovered or focused with the keyboard.
// - On touch devices there is no hover, so the text is always visible there.
export default function ServiceCard({ item }) {
  const Icon = icons[item.id] ?? Sparkles;
  const isLink = Boolean(item.href);

  return (
    <li
      // Focusable so keyboard users can reveal the text too (links already are focusable)
      tabIndex={isLink ? undefined : 0}
      className={`group relative aspect-[3/4] w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl bg-stone-300 sm:w-[44%] lg:w-[31%] xl:w-[24%] ${focusRing}`}
    >
      {/* Decorative: the title names the service */}
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 31vw, (min-width: 640px) 44vw, 78vw"
        className="object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.05]"
      />

      {/* Soft darkening that fades in with the text (mouse devices only) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#1E0F06]/55 via-transparent to-transparent transition-opacity duration-500 motion-reduce:transition-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
      />

      {/* Icon chip: always visible, so a card is never blank */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#1E0F06]/35 text-[#F3D08A] backdrop-blur-md"
      >
        <Icon size={20} strokeWidth={1.5} />
      </span>

      {/* Arrow, only when the card is a link */}
      {isLink && (
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#C8972B] text-[#1E0F06] transition-transform duration-300 group-hover:rotate-12 motion-reduce:transition-none"
        >
          <ArrowUpRight size={20} />
        </span>
      )}

      {/* Frosted text panel: slides up and fades in on hover / keyboard focus */}
      <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-[#1E0F06]/60 p-4 backdrop-blur-md transition-all duration-500 ease-out motion-reduce:transition-none sm:p-5 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 motion-reduce:[@media(hover:hover)]:translate-y-0">
        <h3 className="font-heading text-2xl leading-snug text-white sm:text-[26px]">
          {isLink ? (
            <Link
              href={item.href}
              className={`rounded-sm after:absolute after:inset-0 after:content-[''] ${focusRing}`}
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>
        <span
          aria-hidden="true"
          className="mt-3 block h-0.5 w-8 bg-[#C8972B]"
        />
        <p className="mt-3 text-[15px] leading-7 text-white/90">
          {item.description}
        </p>
      </div>
    </li>
  );
}