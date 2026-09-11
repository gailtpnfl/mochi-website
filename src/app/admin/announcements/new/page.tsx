import { AnnouncementForm } from "@/components/admin/announcement-form";

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New announcement</h1>
      <div className="mt-6">
        <AnnouncementForm />
      </div>
    </div>
  );
}
