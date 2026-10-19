import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-cols-2 grid-rows-2 gap-4 p-4">
      <Card className="shadow-lg" />
      <Card className="shadow-lg" />
      <Card className="col-span-2 shadow-lg" />
    </div>
  );
}
