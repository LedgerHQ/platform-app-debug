import React, { useEffect, useState } from "react";
import { DebuggerV2 } from "../src/components/DebuggerV2";
import { PageLayout } from "../src/PageLayout";

function V2(): React.ReactElement {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return <PageLayout>{mounted ? <DebuggerV2 /> : null}</PageLayout>;
}

export default V2;
