import Link from "next/link";
import Image from "next/image";
import { getAuthUser } from "@/lib/auth.server";
import { Button } from "@/components/ui/button";
import { HeaderProfile } from "./HeaderProfile";

export async function Header() {
  const user = await getAuthUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto">
        <Link
          href="/courses"
          className="font-bold text-xl flex items-center gap-2"
        >
          <Image
            src="/logo-header.png"
            alt="Logo"
            width={140}
            height={21}
            loading="eager"
          />
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <HeaderProfile user={user} />
          ) : (
            <>
              <Link href="/login">
                <Button variant="link">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
