export default function HeroVideo() {
    return (
        <div className="relative w-full h-[30vh] md:h-[40vh] lg:h-[80vh] overflow-hidden">
            {/*
        Optimized Video Element
        - playsInline: Essential for iOS Safari to play inline instead of forcing fullscreen.
        - autoPlay & muted: Chrome/Safari requires videos to be muted for autoplay.
        - loop: Loops continuously without flashing.
        - preload="auto": Tells the browser to start caching video bytes immediately.
      */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
                poster="/videos/hero-poster.jpg"
            >
                {/* Modern high-efficiency format (AV1 or HEVC/H.265) */}
                {/* Add an AV1/HEVC source here if you have one */}

                {/* Universal fallback format (H.264) */}
                <source src="/videos/hero-video.webm" type="video/mp4" />

                {/* Legacy browser fallback text */}
                Your browser does not support the video tag.
            </video>

            {/* Optional Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Visual Content Placed Over Video */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
                    Next-Gen Manufacturing
                </h1>
            </div>
        </div>
    );
}