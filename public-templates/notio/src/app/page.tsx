import Beam from "@/components/beam";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Footer from "@/components/footer";
import LogoCloud from "@/components/logo-cloud";
import Navbar from "@/components/navbar";
import Pricing from "@/components/pricing";
import Stats from "@/components/stats";
import Team from "@/components/team";
import Testimonial from "@/components/testimonial";

export default function Page() {
    return (
        <div className="relative flex flex-col gap-8 overflow-hidden p-3 md:p-2">
            <Navbar />
            <Hero />
            <LogoCloud />
            <Beam>
                <Features />
            </Beam>
            <Stats />
            <Team />
            <Testimonial />
            <Pricing />
            <Footer />
        </div>
    );
}
