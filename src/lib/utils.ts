import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "yyyy.MM.dd.(E) HH:mm", {
    locale: ko,
  });
}

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11
  )}`;
}

export const formatNumberWithCommas = (value: number | string): string => {
  const num =
    typeof value === "string" ? parseInt(value.replace(/,/g, ""), 10) : value;
  if (isNaN(num)) return "";
  return num.toLocaleString("ko-KR");
};

export const parseFormattedNumber = (value: string): number => {
  const parsed = parseInt(value.replace(/,/g, ""), 10);
  return isNaN(parsed) ? 0 : parsed;
};
