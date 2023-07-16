import { CssBaseline, AppBar, Toolbar, Box, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { Outlet } from "react-router-dom"

const IndexAppBar = () => {
    return (<AppBar>
        <Toolbar>
            <Box width="100%" display="flex" justifyContent="flex-end" alignItems="center">
                <Button component={Link} to="/soal12" color="inherit">Soal 1&2</Button>
                <Button component={Link} to="/soal3" color="inherit">Soal 3</Button>
            </Box>
        </Toolbar>
    </AppBar>)
}

const IndexLayout = () => {
    return (<>
        <CssBaseline />
        <IndexAppBar />
        <Toolbar/>
        <Outlet />
    </>)
}

export default IndexLayout