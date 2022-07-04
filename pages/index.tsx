import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DebuggerV2 } from "../src/components/DebuggerV2";
import { PageLayout } from "../src/PageLayout";

function V2(): React.ReactElement {
  const [mounted, setMounted] = useState(false);
  const [isMock, setIsMock] = useState(false);

  const router = useRouter();

  const { params } = router?.query;

  useEffect(() => {
    const isMock = params ? JSON.parse(params as string).mock : false;

    if (params) {
      setMounted(true);
      setIsMock(isMock);
    }

    return () => setMounted(false);
  }, [params]);
  return (
    <PageLayout>{mounted ? <DebuggerV2 isMock={isMock} /> : null}</PageLayout>
  );
}

export default V2;
