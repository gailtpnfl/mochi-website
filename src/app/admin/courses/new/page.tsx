import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New course</h1>
      <div className="mt-6">
        <CourseForm />
      </div>
    </div>
  );
}
