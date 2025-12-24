import { RouterProvider, createRouter } from "@tanstack/react-router"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

// i18n initialization
import "@/i18n"

import { gameLoop } from "./engine/GameLoop"
import "./index.css"
import { RootLayout } from "./routes/__root"
import { Routes } from "./routes/routes"

const routeTree = RootLayout.addChildren(Routes)

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

async function toggleFullscreen() {
  const appWindow = getCurrentWindow()
  const isFullscreen = await appWindow.isFullscreen()
  await appWindow.setFullscreen(!isFullscreen)
}

document.addEventListener("keyup", (e) => {
  if (e.key === "F11") {
    e.preventDefault() // Detiene cualquier acción predeterminada que pueda quedar

    toggleFullscreen()
  }
})

// Iniciar el GameLoop
gameLoop.start()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("app")!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
