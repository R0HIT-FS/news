import { NextResponse } from "next/server";

export function success(
  message: string,
  data?: unknown,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
    }
  );
}

export function failure(
  message: string,
  status = 400,
  errors?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    {
      status,
    }
  );
}