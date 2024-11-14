import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const LearnMoreButton = React.forwardRef<HTMLDivElement>((props, ref) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (ref) {
      const ctx = gsap.context(() => {
        tl.current = gsap.timeline();
        tl.current?.from(buttonRef.current, {
          y: "40",
          opacity: 0,
          delay: 0.6,
          duration: 0.8,
          ease: "power3.out",
        });
      }, ref);

      return () => ctx.revert();
    }
  }, [ref]);

  return (
    <div ref={ref}>
      <Link
        href="/learnMore"
        className="bg-primary-green text-white py-2 px-4 rounded-sm drop-shadow-default hover:bg-secondary-green transition-all"
        ref={buttonRef}
      >
        {t("learnMore.learnMore")}
      </Link>
    </div>
  );
});

LearnMoreButton.displayName = "LearnMoreButton";

export default LearnMoreButton;