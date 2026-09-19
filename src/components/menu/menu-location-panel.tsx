"use client";

import { LocationSelector } from "@/components/location/location-selector";

type MenuLocationPanelProps = {
  selectedLocationPublicId: string;
  branchName: string;
  menuDisplayName: string;
};

export function MenuLocationPanel({
  selectedLocationPublicId,
  branchName,
  menuDisplayName,
}: MenuLocationPanelProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5">
      <div className="flex flex-col gap-2">
        <p className="t-label">Branch menu</p>
        <p className="text-[15px] text-mocha">
          Showing <span className="font-medium">{menuDisplayName}</span> for{" "}
          <span className="font-medium">{branchName}</span>.
        </p>
      </div>
      <LocationSelector selectedLocationPublicId={selectedLocationPublicId} />
    </div>
  );
}
