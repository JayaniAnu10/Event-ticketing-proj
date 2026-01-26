import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./pages/HomePage", () => ({
  default: () => <div>Home Page Loaded</div>,
}));

describe("App", () => {
  it("renders HomePage", () => {
    render(<App />);
    expect(screen.getByText("Home Page Loaded")).toBeInTheDocument();
  });
});
