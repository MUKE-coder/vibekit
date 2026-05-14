"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Tagline } from "@/components/pro-blocks/landing-page/tagline";

export function FaqSection2() {
  return (
    <section
      className="bg-background section-padding-y border-b"
      aria-labelledby="faq-heading"
      id="faq"
    >
      <div className="container-padding-x container mx-auto">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Left Column */}
          <div className="section-title-gap-lg flex flex-1 flex-col">
            {/* Category Tag */}
            <Tagline>FAQ</Tagline>
            {/* Main Title */}
            <h1 id="faq-heading" className="heading-lg text-foreground">
              Find answers to our frequently asked questions
            </h1>
            {/* Section Description */}
            <p className="text-muted-foreground">
              We&apos;ve compiled the most important information to help you get
              the most out of your experience. Can&apos;t find what you&apos;re
              looking for?{" "}
              <Link href="#" className="text-primary underline">
                Contact us.
              </Link>
            </p>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 flex-col gap-8">
            {/* General FAQ Section */}
            <div className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-foreground text-lg font-semibold md:text-xl">
                General
              </h2>
              {/* FAQ Accordion */}
              <Accordion
                type="single"
                collapsible
                aria-label="General FAQ items"
              >
                {/* FAQ Item 1 */}
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How does MindSpace join my meetings?
                  </AccordionTrigger>
                  <AccordionContent>
                    MindSpace automatically joins your scheduled meetings
                    through calendar integration. Simply connect your calendar
                    (Google Calendar, Outlook, etc.) and MindSpace will join
                    meetings at the scheduled time. You can also manually invite
                    MindSpace to any meeting by adding our bot email to your
                    meeting participants.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 2 */}
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    What languages does MindSpace support?
                  </AccordionTrigger>
                  <AccordionContent>
                    MindSpace currently supports English, Spanish, French,
                    German, Italian, Portuguese, and Japanese. We&apos;re
                    continuously adding more languages based on user demand. The
                    AI transcription and analysis work in the primary language
                    of your meeting, with automatic language detection for
                    mixed-language conversations.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 3 */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Can I edit or delete meeting transcripts?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you have full control over your meeting transcripts.
                    You can edit any part of the transcript to correct errors,
                    add context, or remove sensitive information. You can also
                    delete entire transcripts or specific sections. All edits
                    are tracked with timestamps, and you can revert changes at
                    any time.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 4 */}
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    How accurate is the AI transcription?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our AI transcription achieves 95%+ accuracy in ideal
                    conditions (clear audio, minimal background noise, standard
                    accents). Accuracy may vary with poor audio quality, heavy
                    accents, or technical terminology. We continuously improve
                    our models, and you can always manually edit transcripts for
                    perfect accuracy.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Billing FAQ Section */}
            <div className="flex flex-col gap-2">
              {/* Section Title */}
              <h2 className="text-foreground text-lg font-semibold md:text-xl">
                Billing
              </h2>
              {/* FAQ Accordion */}
              <Accordion
                type="single"
                collapsible
                aria-label="Billing FAQ items"
              >
                {/* FAQ Item 1 */}
                <AccordionItem value="billing-1">
                  <AccordionTrigger className="text-left">
                    How does the free plan work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our free plan includes up to 5 hours of meeting
                    transcription per month, basic AI summaries, and access to
                    core features. You can upgrade to paid plans anytime for
                    unlimited transcription, advanced analytics, and premium
                    features. No credit card required to start with the free
                    plan.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 2 */}
                <AccordionItem value="billing-2">
                  <AccordionTrigger className="text-left">
                    Can I change my plan anytime?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can upgrade, downgrade, or cancel your plan at any
                    time. Changes take effect immediately, and we&apos;ll
                    prorate any charges. If you downgrade, you&apos;ll keep
                    access to premium features until the end of your current
                    billing period. No long-term contracts or cancellation fees.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 3 */}
                <AccordionItem value="billing-3">
                  <AccordionTrigger className="text-left">
                    Do you offer annual billing discounts?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer a 20% discount when you choose annual billing.
                    This applies to all paid plans and can save you
                    significantly over monthly billing. Annual plans are billed
                    upfront and automatically renew unless cancelled. You can
                    still change plans during your annual term.
                  </AccordionContent>
                </AccordionItem>

                {/* FAQ Item 4 */}
                <AccordionItem value="billing-4">
                  <AccordionTrigger className="text-left">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent>
                    We accept all major credit cards (Visa, Mastercard, American
                    Express, Discover), PayPal, and bank transfers for annual
                    plans. All payments are processed securely through Stripe.
                    We also support corporate invoicing for enterprise customers
                    with net 30 payment terms.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
