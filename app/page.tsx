"use client"

import { useRouter } from "next/navigation";
import { getBaseUrl, getCustomerId, getDviceId, getUserContext } from "../auth/auth-context";
import { useEffect } from "react";

function Home({}) {
  const router = useRouter();
  useEffect(() => {
    if (getUserContext() && getCustomerId() && getDviceId()) router.push("dashboard");
    else if (getUserContext()) router.push("institute-selection");
    else if (getBaseUrl()) router.push("login");
    else router.push("institute-selection");
  },[router]);

  return null;
}

export default Home;