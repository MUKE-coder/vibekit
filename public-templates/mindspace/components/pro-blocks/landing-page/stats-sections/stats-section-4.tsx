"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

export function StatsSection4() {
  return (
    <section className="bg-background section-padding-y border-b">
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
            <Tagline>Metrics</Tagline>
            <h2 className="heading-lg text-foreground">Numbers don’t lie</h2>
            <p className="text-muted-foreground">
              Add a concise value statement that explains how your metrics
              demonstrate success and growth. Focus on transformation.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">
                  Meetings analyzed
                </h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  5M+
                </span>

                <p className="text-muted-foreground text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  interdum hendrerit ex vitae sodales.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Hours saved</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  500K+
                </span>
                <p className="text-muted-foreground text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  interdum hendrerit ex vitae sodales.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary rounded-xl border-none p-6 shadow-none">
              <CardContent className="flex flex-col gap-2 p-0 md:gap-3">
                <h3 className="text-primary font-semibold">Rating</h3>
                <span className="text-foreground text-3xl font-semibold md:text-4xl">
                  4.85/5
                </span>
                <p className="text-muted-foreground text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  interdum hendrerit ex vitae sodales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
