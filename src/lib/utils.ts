import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMobile() {
  const userAgentCheck = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return userAgentCheck && touchCheck;
}