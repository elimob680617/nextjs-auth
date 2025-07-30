import { Course } from "@/app/(dashboard)/dashboard/courses/_types/courses.types";
import { getSession } from "@/app/utils/session";
import { unauthorized } from "next/navigation";

export const getCourses = async (): Promise<Course[]> => {
  const session = await getSession();
  const response = await fetch(
    "https://general-api.classbon.com/api/identity/courses",
    {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );
  if (response.status === 401) {
    unauthorized();
  }

  return await response.json();
};
