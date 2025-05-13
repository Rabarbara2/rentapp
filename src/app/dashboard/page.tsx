// src/app/dashboard/page.tsx
import ProfileInfo from "./profileinfo/page";

export default function DashboardPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <ProfileInfo />
    </>
  );
}
