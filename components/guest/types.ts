import type { GuestState } from "@/lib/guest-store";

export type GuestTab =
  | "home"
  | "sales"
  | "customers"
  | "catalog"
  | "expenses"
  | "more";

export type GuestRoute =
  | { kind: "home" }
  | { kind: "sales" }
  | { kind: "customers" }
  | { kind: "catalog" }
  | { kind: "more" }
  | { kind: "new-sale"; customer?: { name: string; phone: string } }
  | { kind: "sale"; id: string }
  | { kind: "customer"; key: string }
  | { kind: "item"; id: string }
  | { kind: "settings" }
  | { kind: "expenses" }
  | { kind: "cash" };

export type GuestViewProps = {
  state: GuestState;
  update: (updater: (state: GuestState) => GuestState) => void;
  go: (route: GuestRoute) => void;
  back: () => void;
  toast: (message: string) => void;
  signInHref: string;
};

export function tabForRoute(route: GuestRoute): GuestTab {
  switch (route.kind) {
    case "sales":
    case "sale":
    case "new-sale":
      return "sales";
    case "customers":
    case "customer":
      return "customers";
    case "catalog":
    case "item":
      return "catalog";
    case "more":
    case "settings":
    case "cash":
      return "more";
    case "expenses":
      return "expenses";
    default:
      return "home";
  }
}
