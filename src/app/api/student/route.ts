import { getPrisma } from "@/libs/getPrisma";
import { Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export type StudentGetResponse = {
  students: Student[];
};

export const GET = async () => {
  const prisma = getPrisma();

  //2. Display list of student
  const students = await prisma.student.findMany({
    orderBy: {
      studentId: "asc",
    },
  });

  return NextResponse.json<StudentGetResponse>({
    students,
  });
};

export type StudentPostOKResponse = { ok: true };
export type StudentPostErrorResponse = { ok: false; message: string };
export type StudentPostResponse =
  | StudentPostOKResponse
  | StudentPostErrorResponse;

export type StudentPostBody = Pick<
  Student,
  "studentId" | "firstName" | "lastName"
>;

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as StudentPostBody;
  const prisma = getPrisma();

  const existingStudent = await prisma.student.findUnique({
    where: {
      studentId: body.studentId,
    },
  });

  if (existingStudent) {
    return NextResponse.json<StudentPostErrorResponse>(
      {
        ok: false,
        message: "Student Id already exists",
      },
      { status: 400 }
    );
  }

  const newStudent = await prisma.student.create({
    data: body,
  });

  return NextResponse.json<StudentPostOKResponse>({ ok: true });
};
