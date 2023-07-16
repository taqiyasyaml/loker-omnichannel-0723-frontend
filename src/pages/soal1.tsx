import { Theme, Container, Grid, Box, Skeleton, Pagination, Typography, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { lazy, useState, Suspense } from "react"

const Soal2 = lazy(() => import('../components/Soal2'))

interface Product {
    id: string | number,
    title: string,
    description: string,
    price: number,
    discountPercentage: number,
    rating: number,
    stock: number,
    brand: string,
    category: string,
    thumbnail: string,
    images: string[]
}

interface Data {
    products: Product[],
    total: number,
    skip: number,
    limit: number
}

const Soal1 = () => {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isError, setError] = useState<boolean>(false)
    const [data, setData] = useState<Data | undefined>()
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(30)
    const [idProductModal, setIDProductModal] = useState<string | number | undefined>()

    const onViewClick = async (e?: any, p: number = page) => {
        if (isLoading === true) return
        setError(false)
        setLoading(true)
        try {
            const total = data?.total ?? 0
            const tmpSkip = Math.min((p - 1) * limit, total)
            const res = await fetch(
                ((window as any)?.REACT_APP_API_URL ?? "") + "/api/soal1?limit=" + encodeURIComponent(limit) + "&skip=" + encodeURIComponent(tmpSkip)
            )
            setLoading(false)
            if (res.status === 200) {
                const tmpData = (await res.json()) as Data
                setData(tmpData)
                setPage(Math.max(1, Math.floor(tmpData.skip / limit) + 1))
            } else setError(true)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    const onPageChange = async (e: any, p: number) => {
        if (isLoading === true) return
        setPage(Math.max(1, p))
        await onViewClick(e, Math.max(1, p))
    }

    return (<>
        <Container>
            <Grid container mt={2} mx={2} spacing={1}>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <Typography variant="h5">Product List</Typography>
                    <Button variant="contained" onClick={onViewClick} color={isError === true ? 'error' : 'primary'}>Show Products</Button>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading === true ?
                                    [...Array(Math.max(1, (data?.products ?? []).length))].map((d, i) =>
                                    (<TableRow key={i}>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                    </TableRow>)
                                    ) : (data?.products ?? []).map(d => (<TableRow key={d.id}>
                                        <TableCell>
                                            <Box maxWidth={(t: Theme) => `${(4 / 12) * t.breakpoints.values.sm}px`}>
                                                <img src={d.thumbnail} alt={d.title} style={{ width: "100%" }} />
                                            </Box>
                                        </TableCell>
                                        <TableCell>{d.title}</TableCell>
                                        <TableCell>{d.category}</TableCell>
                                        <TableCell>{d.brand}</TableCell>
                                        <TableCell>{d.stock}</TableCell>
                                        <TableCell>${d.price.toLocaleString('en-US')}</TableCell>
                                        <TableCell><Button onClick={() => setIDProductModal(d.id)} variant="contained">View</Button></TableCell>
                                    </TableRow>))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <Typography>SHOW: {Array.isArray(data?.products) ? data?.products.length : 0} ITEMS</Typography>
                    <Pagination
                        count={
                            Math.max(1,
                                Math.ceil(
                                    (data?.total ?? 0) /
                                    Math.max(1, limit)
                                )
                            )
                        }
                        page={Math.max(1, page)}
                        onChange={onPageChange}
                        showFirstButton
                        showLastButton
                    />
                </Grid>
            </Grid>
        </Container>
        <Suspense>
            <Soal2
                id={idProductModal}
                onClose={() => setIDProductModal(undefined)}
            />
        </Suspense>
    </>)
}

export default Soal1