import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  BriefcaseBusiness,
  BusFront,
  Car,
  CarFront,
  Landmark,
  Mountain,
  Plane,
  Sparkles,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  taxi: CarFront,
  bus: BusFront,
  chauffeur: CarFront,
  selfDrive: Car,
  sedan: CarFront,
  suv: Car,
  muv: Car,
  tempo: Truck,
  miniBus: BusFront,
  luxuryBus: BusFront,
  users: Users,
  temple: Landmark,
  plane: Plane,
  briefcase: BriefcaseBusiness,
  sparkles: Sparkles,
  mountain: Mountain,
};

type MediaFrameProps = {
  src?: string;
  alt: string;
  icon?: string;
  className?: string;
  imageClassName?: string;
  aspect?: string;
  priority?: boolean;
  sizes?: string;
};

export function MediaFrame({
  src,
  alt,
  icon = "car",
  className,
  imageClassName,
  aspect = "aspect-[4/3]",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: MediaFrameProps) {
  const t = useTranslations("common");
  const Icon = iconMap[icon] ?? CarFront;

  return (
    <div
      className={cn(
        "media-navy relative overflow-hidden",
        aspect,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="rounded-full border border-gold/40 bg-white/5 p-6">
            <Icon className="size-12 text-gold/80 sm:size-14" strokeWidth={1.2} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
            {t("photoPending")}
          </span>
        </div>
      )}
    </div>
  );
}
