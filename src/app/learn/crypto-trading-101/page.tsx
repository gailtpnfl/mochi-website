import type { Metadata } from "next";
import { COURSE } from "@/lib/course/crypto-101-data";
import { CourseHome } from "@/components/course/course-home";

export const metadata: Metadata = {
  title: COURSE.title,
  description: COURSE.subtitle,
};

export default function CryptoTrading101Page() {
  return <CourseHome />;
}
