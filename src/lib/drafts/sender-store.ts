import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SenderProfile = {
  name: string;
  city: string;
  email: string;
  phone: string;
  offer: string;
  proof: string;
  address: string;
  pan: string;
  gstin: string;
  fee: string;
  advancePct: string;
  draftDays: string;
  revisions: string;
  responseHours: string;
};

const empty: SenderProfile = {
  name: "x",
  city: "",
  email: "",
  phone: "",
  offer: "",
  proof: "",
  address: "",
  pan: "",
  gstin: "",
  fee: "",
  advancePct: "50",
  draftDays: "7",
  revisions: "1",
  responseHours: "24",
};

type SenderState = SenderProfile & {
  setField: <K extends keyof SenderProfile>(key: K, value: SenderProfile[K]) => void;
};

export const useSenderStore = create<SenderState>()(
  persist(
    (set) => ({
      ...empty,
      setField: (key, value) => set({ [key]: value } as Partial<SenderProfile>),
    }),
    { name: "nyayadraft-sender" },
  ),
);

export function senderPayload(s: SenderProfile) {
  return {
    name: (s.name.trim() || "x").slice(0, 80),
    city: s.city.trim().slice(0, 80) || undefined,
    email: s.email.trim().slice(0, 120) || undefined,
    phone: s.phone.trim().slice(0, 40) || undefined,
    offer: s.offer.trim().slice(0, 400) || undefined,
    proof: s.proof.trim().slice(0, 280) || undefined,
    address: s.address.trim().slice(0, 240) || undefined,
    pan: s.pan.trim().slice(0, 20) || undefined,
    gstin: s.gstin.trim().slice(0, 20) || undefined,
    fee: s.fee.trim().slice(0, 40) || undefined,
    advancePct: s.advancePct.trim().slice(0, 8) || undefined,
    draftDays: s.draftDays.trim().slice(0, 8) || undefined,
    revisions: s.revisions.trim().slice(0, 8) || undefined,
    responseHours: s.responseHours.trim().slice(0, 8) || undefined,
  };
}
