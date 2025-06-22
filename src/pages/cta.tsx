import { WavyBackground } from "@/components/ui/wavy-background";
import WhatsappButton from "@/components/whatsapp-button";
import Link from "next/link";

const CTA = () => {
  return (
    <WavyBackground className="max-w-4xl mx-auto m-5 md:py-20">
      <div className="text-center -mt-5 bg-gray-900/70 backdrop-blur-md rounded-lg p-4 md:p-12 border border-gray-800 max-w-4xl mx-auto">
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Ready to start your project?
        </h3>
        <p className="text-lg md:text-2xl text-gray-400 mb-3 md:mb-8">
          Get in touch for a personalized quote today!
        </p>
        <Link
          href="https://wa.me/919404570482"
          className="inline-flex items-center"
        >
          {/* <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4 8.95 8.95 0 0 0 3.1 12.95a8.93 8.93 0 0 0 1.32 4.69L3 22l4.47-1.17a8.95 8.95 0 0 0 13.53-7.88 8.85 8.85 0 0 0-3.4-6.63zm-5.55 13.68a7.45 7.45 0 0 1-3.79-1.04l-.27-.16-2.82.74.75-2.75-.18-.28a7.43 7.43 0 0 1 9.78-10.19 7.36 7.36 0 0 1 2.83 5.52 7.45 7.45 0 0 1-7.46 8.16z" />
              <path d="M9.06 7.76c-.16-.09-.59-.29-.68-.32-.09-.03-.16-.05-.22.05-.07.09-.26.32-.32.39-.06.07-.11.08-.2 0-.1-.08-.43-.17-.82-.54a3 3 0 0 1-.56-.7c-.06-.1 0-.15.04-.2l.14-.16c.05-.06.07-.1.1-.17.03-.07.01-.13-.01-.18-.03-.05-.22-.52-.3-.72-.07-.2-.15-.17-.21-.17h-.18c-.07 0-.17.03-.26.14-.09.11-.34.35-.34.85s.35.98.4 1.05c.04.07.62.95 1.5 1.33.21.09.38.14.5.18.21.07.41.06.56.03.17-.03.52-.21.6-.42.06-.2.06-.38.04-.42-.02-.03-.09-.08-.18-.12z" />
            </svg>
            Contact us on WhatsApp */}
          <WhatsappButton className="md:scale-[120%]" />
        </Link>
      </div>
    </WavyBackground>
  );
};

export default CTA;
