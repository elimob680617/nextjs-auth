import { getCourses } from "@/app/_actions/courses-actions";

export default async function Page() {
  const courses = await getCourses();
  return (
    <>
      {courses?.map((course) => (
        <p className="my-2 text-lg" key={course.title}>
          {course.title}
        </p>
      ))}
    </>
  );
}
