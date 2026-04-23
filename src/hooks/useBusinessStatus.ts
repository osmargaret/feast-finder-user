import { useMemo } from "react";
import { vendors } from "@/data/mock";

export function useBusinessStatus(vendorId: string) {
  const vendor = useMemo(() => vendors.find((v) => v.id === vendorId), [vendorId]);

  const status = useMemo(() => {
    if (!vendor || !vendor.openHours) return { isOpen: true, next: "" }; // Fallback

    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const currentTime = currentH * 60 + currentM;

    const [startH, startM] = vendor.openHours.start.split(":").map(Number);
    const [endH, endM] = vendor.openHours.end.split(":").map(Number);
    
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    // Handle overnight shifts (e.g. 16:00 to 02:00)
    if (endMinutes < startMinutes) {
      if (currentTime >= startMinutes || currentTime < endMinutes) {
        return { isOpen: true, next: `Closes at ${vendor.openHours.end}` };
      }
      return { isOpen: false, next: `Opens at ${vendor.openHours.start}` };
    }

    if (currentTime >= startMinutes && currentTime < endMinutes) {
      return { isOpen: true, next: `Closes at ${vendor.openHours.end}` };
    }

    return { isOpen: false, next: `Opens at ${vendor.openHours.start}` };
  }, [vendor]);

  return status;
}
