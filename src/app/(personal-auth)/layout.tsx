import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Shared UI here, header / sidebar */}

      {children}
    </div>
  );
}
