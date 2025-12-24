import { createRoute } from "@tanstack/react-router"

import { RootLayout } from "./__root"

const Index = () => (
  <div className="p-2">
    <h3>Welcome Home!</h3>
  </div>
)

export const IndexRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: "/",
  component: Index,
})
