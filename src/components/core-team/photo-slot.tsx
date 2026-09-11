import Image from "next/image";
import { initials } from "@/data/coreTeam";

/**
 * Replaces the redesign's `<image-slot>` scaffold, which is a design-tool
 * custom element and must not ship.
 *
 * Every slot in the source file is empty, so the fallback is the state you
 * actually see today: a tinted panel with the member's initials, sized exactly
 * like the photo it stands in for, so nothing reflows when real photography
 * lands. Set `photo` on the member to swap it in.
 *
 * Sizes live in core-team.css keyed by variant; the numbers here are only the
 * intrinsic dimensions next/image needs to reserve the right aspect ratio.
 */
const VARIANTS = {
  /** ct-founder — 340×420 rounded */
  founder: { w: 340, h: 420 },
  /**
   * ct-coo / ct-cto / ct-cmo / ct-cco / ct-director — a 96px circle on the
   * standalone /core-team page, but the landing page's embedded team grid
   * (.ct-embedded .ct-team-card-media in landing.css) renders the same photo
   * in a 112px circle. next/image builds its srcset off this `w` (1x/2x,
   * since neither call site passes `sizes`), so leaving it at 96 capped
   * Retina screens at a 192px image — short of the ~224px a 112px circle
   * needs at 2x, which read as soft/low-res. Sized past what either circle
   * needs at 2x so both pages get a properly sharp srcset entry; the actual
   * render box still comes from each page's own CSS (.ct-slot img/.. is
   * width:100%;height:100%), so this doesn't change anything's layout size.
   */
  lead: { w: 224, h: 224 },
  /** ct-m3 / ct-m6 — mentor portraits, 300px tall, fluid width */
  mentor: { w: 380, h: 300 },
  /** ct-mod1…ct-mod6 — 120px circle on /core-team, 112px on the landing
   * page's embedded grid. Same Retina-srcset fix as `lead` above. */
  moderator: { w: 224, h: 224 },
} as const;

export type PhotoSlotVariant = keyof typeof VARIANTS;

export function PhotoSlot({
  name,
  photo,
  variant,
  priority = false,
  imgClassName,
}: {
  name: string;
  photo?: string;
  variant: PhotoSlotVariant;
  priority?: boolean;
  /** Extra class on the <img> itself (not the slot wrapper) — for a
   * per-member crop fix, e.g. zooming into a photo shot wider than a
   * headshot. See `.ct-photo-zoom` in core-team.css. */
  imgClassName?: string;
}) {
  const { w, h } = VARIANTS[variant];
  const className = `ct-slot ct-slot-${variant}`;

  if (photo) {
    return (
      <div className={className}>
        <Image src={photo} alt={name} width={w} height={h} priority={priority} className={imgClassName} />
      </div>
    );
  }

  return (
    <div className={className} role="img" aria-label={name}>
      <span className="ct-slot-initials" aria-hidden>
        {initials(name)}
      </span>
    </div>
  );
}
