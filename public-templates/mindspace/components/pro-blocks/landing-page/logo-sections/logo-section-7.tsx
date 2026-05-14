"use client";

import { PlaceholderLogo } from "@/components/pro-blocks/placeholder-logo"; /* Make sure to import your logos */
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

const logosData = [
  {
    id: 1,
    component: PlaceholderLogo,
  },
  {
    id: 2,
    component: PlaceholderLogo,
  },
  {
    id: 3,
    component: PlaceholderLogo,
  },
  {
    id: 4,
    component: PlaceholderLogo,
  },
  {
    id: 5,
    component: PlaceholderLogo,
  },
  {
    id: 6,
    component: PlaceholderLogo,
  },
  {
    id: 7,
    component: PlaceholderLogo,
  },
  {
    id: 8,
    component: PlaceholderLogo,
  },
];

export function LogoSection10() {
  return (
    <section className="bg-secondary border-b pb-16 lg:pb-24">
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="section-title-gap-lg flex max-w-xl flex-col items-center text-center">
            <Tagline variant="ghost">Trusted by 10K+ remote teams</Tagline>
          </div>

          <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0%,black_12.5%,black_87.5%,transparent_100%)]">
            <div className="animate-infinite-scroll flex w-max items-center">
              {[...logosData, ...logosData].map((logoItem, index) => {
                const LogoComponent = logoItem.component;
                const uniqueKey = `logo-wrapper-${logoItem.id}-${index}`;
                return (
                  <div
                    key={uniqueKey}
                    className="w-48 flex-shrink-0 place-items-center"
                  >
                    <LogoComponent className="w-36" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50%));
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 20s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
