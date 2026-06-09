import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vite-plus/test";

// Run after each test to keep the jsdom document clean between cases.
afterEach(() => {
  cleanup();
});
