import { createRoute } from "@tanstack/react-router"

import { FarmLaboratory } from "@/views/laboratory/farm/farm_laboratory_view"

import CropsFarmView from "@/views/laboratory/crops/crops_view"
import MainMenu from "@/views/main_menu"
import { RootLayout } from "./__root"

export const Routes = [
  createRoute({
    getParentRoute: () => RootLayout,
    path: "/",
    component: MainMenu,
  }),
  createRoute({
    getParentRoute: () => RootLayout,
    path: "/farm_laboratory",
    component: FarmLaboratory,
  }),
  createRoute({
    getParentRoute: () => RootLayout,
    path: "/crops_farm",
    component: CropsFarmView,
  }),
]
