import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OverlayLayout from "@/app/components/OverlayLayout";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <OverlayLayout>
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="mb-4">
          The Cask Register was founded to bring transparency and innovation to the private whisky investment market.
        </p>
        <p className="mb-4">
          We combine secure web technology with blockchain-based proof of ownership to ensure every cask entry is verified, logged, and protected.
        </p>
        <p>
          Based in Scotland and proud to support the industry’s heritage, our mission is to help you protect your liquid investment.
        </p>
      </OverlayLayout>
      <Footer />
    </>
  );
}
