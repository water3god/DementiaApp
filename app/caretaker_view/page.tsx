import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function CaretakerView() {
  return <div>
    <Card className="aspect-4/3 shadow-lg">
        <CardHeader className="grid-cols-[1fr_auto]">
          <CardTitle className="text-xl">Patients</CardTitle>
          <Link
            href="/contacts"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
           - similar to contact card except its for patients from the caretaker pov
           - click on one of the patients will bring pop-up screen
           - caretaker can type within the pop-up screen and push to-do list onto their end
        </CardContent>

    </Card>
  </div>;

   
    
};


//npm run dev
//http://localhost:3000