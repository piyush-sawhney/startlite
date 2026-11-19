import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Storefront } from "@/components/Storefront";
import { whatsappLink } from "@/lib/bill";
import { getPublicItems, getShop } from "@/lib/queries";
import { storefrontStatus } from "@/lib/shop";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const shop = await getShop(handle);
  if (!shop) {
    return { title: "Shop not found", robots: { index: false, follow: false } };
  }

  const status = storefrontStatus(shop);
  const description =
    shop.tagline ??
    `${shop.businessName}${shop.locality ? ` in ${shop.locality}` : ""}. See prices and order on WhatsApp.`;
  const url = `${(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")}/b/${shop.handle}`;

  return {
    title: `${shop.businessName} · Order on WhatsApp`,
    description,
    alternates: { canonical: url },
    robots:
      status === "live"
        ? { index: true, follow: true }
        : { index: false, follow: false },
    openGraph: {
      title: shop.businessName,
      description,
      url,
      type: "website",
      siteName: "StartLite",
    },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const shop = await getShop(handle);
  if (!shop) notFound();

  const status = storefrontStatus(shop);
  if (status === "disabled") notFound();

  if (status === "paused") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col justify-center px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          StartLite
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {shop.businessName} is paused
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-ink-muted">
          This shop is not taking orders right now. Message the shop on WhatsApp
          to ask when it will open.
        </p>
        <a
          href={whatsappLink(shop.whatsappNumber, "Hello, when will your shop open?")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-5 text-[15px] font-semibold text-white"
        >
          Message the shop
        </a>
      </main>
    );
  }

  const items = await getPublicItems(shop.id);
  const url = `${(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")}/b/${shop.handle}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.businessName,
    description: shop.tagline ?? undefined,
    url,
    telephone: `+${shop.whatsappNumber}`,
    address: shop.locality
      ? { "@type": "PostalAddress", addressLocality: shop.locality }
      : undefined,
    priceRange: "₹₹",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Storefront
        shop={{
          handle: shop.handle,
          name: shop.businessName,
          tagline: shop.tagline,
          locality: shop.locality,
          notice: shop.noticeBanner,
          enableTimeSlots: shop.enableTimeSlots,
          advancePolicyText: shop.advancePolicyText,
          addressPlaceholder: shop.addressPlaceholder,
          showBankDetails: shop.showBankDetails,
          bankAccountName: shop.bankAccountName,
          bankAccountNumber: shop.bankAccountNumber,
          bankIfsc: shop.bankIfsc,
        }}
        items={items}
      />
    </>
  );
}
