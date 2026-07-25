import { AgentsStrip } from "@/components/agents-strip";
import { CommunityBanner } from "@/components/community-banner";
import { ContributeBanner } from "@/components/contribute-banner";
import { Creator } from "@/components/creator";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { FourFiles } from "@/components/four-files";
import { FrameworkFiles } from "@/components/framework-files";
import { GuideDownload } from "@/components/guide-download";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { HowItWorksFlow } from "@/components/how-it-works-flow";
import { JBRegistry } from "@/components/jb-registry";
import { LaptopMockup } from "@/components/laptop-mockup";
import { Nav } from "@/components/nav";
import { PreDeploy } from "@/components/pre-deploy";
import { Problems } from "@/components/problems";
import { Stack } from "@/components/stack";
import { Testimonials } from "@/components/testimonials";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AgentsStrip />
        <HowItWorksFlow />
        <LaptopMockup />
        <Problems />
        <HowItWorks />
        <FourFiles />
        <GuideDownload variant="band" />
        <Stack />
        <FrameworkFiles />
        <PreDeploy />
        <JBRegistry />
        <ContributeBanner />
        <Testimonials />
        <Creator />
        <CommunityBanner />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
