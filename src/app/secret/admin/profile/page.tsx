import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import { getPrimaryAdminUser, getSiteSettings } from "@/lib/admin-db";
import { site } from "@/lib/site";
import { WebProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Web Profile",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WebProfilePage() {
  const [admin, settings] = await Promise.all([
    getPrimaryAdminUser(),
    getSiteSettings(),
  ]);

  const whatsappMessage =
    settings.whatsapp_message?.trim() || site.whatsapp.defaultMessage;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Web Profile"
        description="Update admin login, WhatsApp number and first message, and Google location used on the website."
      />
      <WebProfileForm
        key={`profile-${settings.updated_at}`}
        username={admin?.username ?? "admin"}
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={whatsappMessage}
        locationLabel={settings.location_label}
        locationAddress={settings.location_address}
        locationLat={settings.location_lat}
        locationLng={settings.location_lng}
        mapsLink={settings.maps_link}
      />
    </div>
  );
}
