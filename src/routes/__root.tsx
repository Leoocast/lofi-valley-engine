import { createRootRoute } from "@tanstack/react-router"

import Page from "@/views/layout/layout"

export const RootLayout = createRootRoute({
  component: Page,
})
