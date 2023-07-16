import { lazy, Suspense } from "react"
import { Box, CircularProgress } from "@mui/material"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import IndexLayout from "./pages/index_layout"
import Soal3 from "./pages/soal3"

const Soal1 = lazy(() => import("./pages/soal1"))

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
                    element: (<Suspense>
                        <Soal1 />
                    </Suspense>)
                },
                {
                    path: 'soal3',
                    element: (<Soal3 />)
                }
            ]
        }
    ])
    return (<RouterProvider router={router} />)
}

export default Router