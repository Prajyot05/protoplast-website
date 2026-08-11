import Link from "next/link";

export const metadata = {
    title: "Legal Notice | Protoplast",
    description:
        "Legal Notice for Protoplast Studio LLP and the protoplast.in website.",
};

export default function LegalNoticePage() {
    return (
        <main className="bg-white min-h-screen">
            <div className="container mx-auto px-6 py-20 md:py-28">
                <article className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black mb-4">
                            Legal Notice
                        </h1>

                        <p className="text-sm text-gray-500">
                            Last updated: August 2026
                        </p>
                    </header>

                    <div className="space-y-12 text-gray-700 leading-7">
                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                1. Site Owner
                            </h2>

                            <p className="mb-4">
                                This website, protoplast.in (the "Site"), is owned and
                                operated by:
                            </p>

                            <p>
                                <strong className="text-black">
                                    Protoplast Studio LLP
                                </strong>
                                <br />
                                LLPIN: ACU-8900
                                <br />
                                Amravati, Maharashtra - 444607, India
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

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                2. Purpose of This Site
                            </h2>

                            <p>
                                This Site is provided to present the services, capabilities,
                                and products of Protoplast Studio LLP, and to enable
                                prospective and existing clients to make enquiries. Content
                                on this Site is for general informational purposes and does
                                not constitute a binding offer, quotation, or contract.
                                Formal quotations, statements of work, and agreements are
                                issued separately in writing.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                3. Intellectual Property
                            </h2>

                            <p>
                                All content on this Site, including but not limited to text,
                                graphics, logos, images, and the underlying design, is the
                                property of Protoplast Studio LLP unless otherwise credited,
                                and is protected under applicable Indian copyright and
                                intellectual property law. Client and partner logos displayed
                                on this Site are used to identify past or ongoing working
                                relationships and remain the property of their respective
                                owners.
                            </p>

                            <p className="mt-4">
                                No content from this Site may be reproduced, distributed, or
                                used for commercial purposes without the prior written consent
                                of Protoplast Studio LLP.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                4. Contact Form and Data Collection
                            </h2>

                            <p>
                                Where you submit information through the contact form on this
                                Site, that information (such as your name, email address, and
                                message content) is collected solely for the purpose of
                                responding to your enquiry and is not sold or shared with
                                third parties for marketing purposes. Data submitted is
                                retained only as long as reasonably necessary to address the
                                enquiry or maintain a business relationship arising from it.
                            </p>

                            <p className="mt-4">
                                For details on cookies used on this Site, please see our{" "}
                                <Link
                                    href="/cookie-policy"
                                    className="text-black font-bold underline underline-offset-4 hover:text-gray-500 transition-colors"
                                >
                                    Cookie Policy
                                </Link>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                5. External Links
                            </h2>

                            <p>
                                This Site may contain links to third-party websites, including
                                but not limited to WhatsApp, LinkedIn, and X (formerly
                                Twitter). Protoplast Studio LLP is not responsible for the
                                content, policies, or practices of any third-party site linked
                                from here.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                6. Limitation of Liability
                            </h2>

                            <p>
                                While Protoplast Studio LLP takes reasonable care to keep
                                information on this Site accurate and current, no warranty is
                                given as to the completeness or accuracy of the content.
                                Protoplast Studio LLP shall not be liable for any loss or
                                damage arising from reliance on information presented on this
                                Site, to the fullest extent permitted by applicable law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                7. Governing Law
                            </h2>

                            <p>
                                This Legal Notice and your use of this Site are governed by the
                                laws of India, and any disputes arising in connection with
                                this Site shall be subject to the exclusive jurisdiction of
                                the competent courts in Amravati, Maharashtra.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-black mb-4">
                                8. Contact Us
                            </h2>

                            <p>
                                For any questions regarding this Legal Notice, please contact:
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