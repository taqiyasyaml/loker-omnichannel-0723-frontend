import { lazy, Suspense } from "react"
import { Box, CircularProgress } from "@mui/material"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import IndexLayout from "./pages/index_layout"

const Soal1 = lazy(() => import("./pages/soal1"))
const Soal3 = lazy(() => import("./pages/soal3"))

const SuspenseFallBack = () => {
    return (<>
        <Box sx={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    </>)
}

const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (<IndexLayout />),
            children: [
                {
                    index: true,
                    element: (<Suspense fallback={<SuspenseFallBack />}>
                        <Soal1 />
                    </Suspense>)
                },
                {
                    path: 'soal12',
                    element: (<Suspense fallback={<SuspenseFallBack />}>
                        <Soal1 />
                    </Suspense>)
                },
                {
                    path: 'soal3',
                    element: (<Suspense fallback={<SuspenseFallBack />}>
                        <Soal3 />
                    </Suspense>)
                }
            ]
        }
    ])
    return (<RouterProvider router={router} />)
}

export default Router