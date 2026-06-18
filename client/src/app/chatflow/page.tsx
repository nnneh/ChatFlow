"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatFlowIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/chatflow/chat");
  }, []);

  return null;
}