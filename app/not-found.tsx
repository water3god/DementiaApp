import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Centered from "@/components/centered";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

// Replaces Next's default 404, which is a full 100vh tall and so overflows
// the space below the top bar.
export default function NotFound() {
  return (
    <Centered>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>This page doesn&apos;t exist, or you don&apos;t have access to it.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants()}>
            Go home
          </Link>
        </EmptyContent>
      </Empty>
    </Centered>
  );
}
