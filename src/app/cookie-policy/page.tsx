import Link from "next/link";

export const metadata = {
    title: "Cookie Policy | Protoplast",
    description:
        "Cookie Policy for Protoplast Studio LLP and the protoplast.in website.",
};

export default function CookiePolicyPage() {
    return (
        <main className="bg-white min-h-screen">
            <div className="container mx-auto px-6 py-20 md:py-28">
                <article className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black mb-4">
                            Cookie Policy
                        </h1>

                        <p className="text-sm text-gray-500">
                            Last updated: August 2026
                        </p>
                    </header>

                    <div className="space-y-12 text-gray-700 leading-7">
                        <p>
                            This Cookie Policy explains how Protoplast Studio LLP
                            (&quot;Protoplast,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar
                            technologies on protoplast.in (the &quot;Site&quot;).
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                1. What Are Cookies
                            </h2>

                            <p>
                                Cookies are small text files placed on your device when you
                                visit a website. They are commonly used to make websites
                                function properly, remember preferences, or collect
                                information about how a site is used.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                2. Cookies We Use
                            </h2>

                            <p>
                                Protoplast.in does not currently use analytics, advertising, or
                                tracking cookies. We do not use tools such as Google Analytics,
                                Meta Pixel, or similar third-party tracking services on this
                                Site.
                            </p>

                            <p className="mt-4">
                                The Site may use strictly necessary cookies or similar local
                                storage required for core functionality (for example, to
                                remember your session while browsing or to support the contact
                                form). These are technical in nature and do not track you
                                across other websites.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                3. Contact Form Data
                            </h2>

                            <p>
                                If you use the contact form on this Site, the information you
                                submit (such as your name, email address, and message) is
                                collected and stored by us in order to respond to your
                                enquiry. This is not cookie-based tracking; it is data you
                                actively choose to submit. Please see our{" "}
                                <Link
                                    href="/legal-notice"
                                    className="text-black font-bold underline hover:text-gray-500 transition-colors"
                                >
                                    Legal Notice
                                </Link>{" "}
                                for further information on how this data is used.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                4. Changes to This Policy
                            </h2>

                            <p>
                                If Protoplast begins using analytics, advertising, or other
                                tracking cookies in the future, this Cookie Policy will be
                                updated accordingly, and where required by law, we will seek
                                your consent before such cookies are set.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                5. Managing Cookies
                            </h2>

                            <p>
                                Most browsers allow you to control or disable cookies through
                                their settings. As this Site does not currently use tracking
                                cookies, no specific opt-out action is required. If our cookie
                                usage changes, this page will reflect the updated position and
                                any applicable controls.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                6. Contact Us
                            </h2>

                            <p>
                                If you have questions about this Cookie Policy, please contact
                                us at:
                            </p>

                            <p className="mt-4">
                                <strong className="text-black">
                                    Protoplast Studio LLP
                                </strong>
                                <br />
                                Amravati, Maharashtra, India
                                <br />
                                Email:{" "}
                                <a
                                    href="mailto:engineering@protoplast.in"
                                    className="text-black underline underline-offset-4 hover:text-gray-500 transition-colors"
                                >
                                    engineering@protoplast.in
                                </a>
                            </p>
                        </section>
                    </div>
                </article>
            </div>
        </main>
    );
}