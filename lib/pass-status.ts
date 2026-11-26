import { formatDateDMY, istDateString } from "./date";

export type PassTone = "good" | "soon" | "expired";

export type PassStatus = {
  label: string;
  tone: PassTone;
  daysLeft: number;
};

/** A pass inside this window is close enough to expiry to warn the merchant. */
const SOON_DAYS = 30;

/**
 * The merchant-facing pass or trial line. The word and the date carry the
 * meaning; the colour only adds urgency.
 */
export function getPassStatus(
  passExpiresAt: Date | null,
  trialEndsAt: Date,
  now = new Date(),
): PassStatus {
  const endsAt = passExpiresAt ?? trialEndsAt;
  const noun = passExpiresAt ? "Quarterly pass" : "3-month trial";
  const date = formatDateDMY(istDateString(endsAt));
  const daysLeft = Math.ceil((endsAt.getTime() - now.getTime()) / 86_400_000);

  if (daysLeft <= 0) {
    return { label: `${noun} expired ${date}`, tone: "expired", daysLeft };
  }
  if (daysLeft <= SOON_DAYS) {
    return { label: `${noun} ends ${date}`, tone: "soon", daysLeft };
  }
  return { label: `${noun} until ${date}`, tone: "good", daysLeft };
}
