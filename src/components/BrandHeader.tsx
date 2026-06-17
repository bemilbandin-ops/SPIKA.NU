import Image from "next/image";
import Link from "next/link";

type BrandHeaderProps = {
  className?: string;
  logoClassName?: string;
  priority?: boolean;
};

export function BrandHeader({
  className,
  logoClassName = "w-[20rem] sm:w-[24rem]",
  priority = false
}: BrandHeaderProps) {
  return (
    <Link
      aria-label="Gå till startsidan"
      className={[
        "inline-flex w-fit",
        className
      ].filter(Boolean).join(" ")}
      href="/"
    >
      <Image
        alt="PickADay"
        className={["h-auto", logoClassName].join(" ")}
        decoding="async"
        height={119}
        priority={priority}
        src="/pickaday-logo.png"
        unoptimized
        width={528}
      />
      <span className="sr-only">PickADay startsida</span>
    </Link>
  );
}
