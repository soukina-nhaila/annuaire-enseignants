import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// jsdom n'implémente pas scrollTo
window.scrollTo = vi.fn();