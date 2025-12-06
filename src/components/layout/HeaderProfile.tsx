"use client";

import { useCourseSelectionStore } from "@/features/course/store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types";
import { Badge } from "../ui/badge";

interface HeaderProfileProps {
  user: User;
}

function ButtonLogout() {
  const { logout } = useAuth();
  const clearSelection = useCourseSelectionStore(
    (state) => state.clearSelection
  );
  const handleLogout = async () => {
    // 선택한 강의 목록 초기화
    clearSelection();
    // 통합 로그아웃 (캐시 초기화 + NextAuth 세션 종료)
    await logout();
  };
  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <span className="text-sm font-medium">로그아웃</span>
    </DropdownMenuItem>
  );
}

export function HeaderProfile({ user }: HeaderProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/circle-user-round.svg" alt={user.name} />
            <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2 overflow-hidden max-w-full">
              <p className="text-sm font-medium leading-none truncate">
                {user.name}
              </p>
              <Badge variant="default" className="py-0">
                {user.userType === "INSTRUCTOR" ? "강사" : "수강생"}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ButtonLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
