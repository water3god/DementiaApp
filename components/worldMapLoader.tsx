"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const WorldMap = dynamic(() => import("./worldMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full rounded-lg" />,
});

export default WorldMap;
