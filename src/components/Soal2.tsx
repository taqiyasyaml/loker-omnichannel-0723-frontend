import { Dialog, DialogTitle, DialogContent, Box, Grid, IconButton, Typography, Rating, Skeleton, CircularProgress } from "@mui/material"
import { Close, Replay } from "@mui/icons-material"
import { useState, useEffect } from "react"

interface Data {
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

interface Soal2Props {
    id?: string | number,
    onClose?: () => void
}
const Soal2 = (props: Soal2Props) => {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isError, setError] = useState<boolean>(false)
    const [data, setData] = useState<Data | undefined>()
    const [srcMainImage, setSrcMainImage] = useState<string>("")

    const loadData = async () => {
        if (props?.id !== undefined) {
            setError(false)
            setLoading(true)
            try {
                const res = await fetch(
                    ((window as any)?.REACT_APP_API_URL ?? "") + "/api/soal2/" + encodeURIComponent(props.id)
                )
                setLoading(false)
                if (res.status === 200) {
                    const tmpData = (await res.json()) as Data
                    setData(tmpData)
                    setSrcMainImage(typeof tmpData?.thumbnail === 'string' ? tmpData.thumbnail : "")
                } else if (res.status === 404) {
                    if (typeof props?.onClose === 'function') props.onClose()
                } else {
                    setError(true)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                setError(true)
            }
        }
    }
    useEffect(() => {
        loadData()
    }, [props?.id])

    const onClose = isLoading !== true ? props.onClose : undefined

    return (<>
        <Dialog open={props?.id !== undefined} maxWidth="md" fullWidth onClose={onClose}>
            <DialogTitle display="flex" justifyContent="space-between">
                {isLoading === true ?
                    <Skeleton sx={{ flexGrow: 1 }} /> : <Box>{data?.title}</Box>
                }
                <IconButton onClick={onClose}
                ><Close /></IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    {
                        isLoading === true ?
                            (<>
                                <Grid item xs={12} display="flex" justifyContent="center"><CircularProgress /></Grid>
                            </>) : (
                                isError === true ?
                                    (<>
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <IconButton onClick={loadData}><Replay /></IconButton>
                                        </Grid>
                                    </>) : (<>
                                        <Grid item xs={12} sm={6}>
                                            <Grid container alignItems="center" spacing={1}>
                                                <Grid item xs={12}>
                                                    <img style={{ width: '100%' }} src={srcMainImage} alt={data?.title} />
                                                </Grid>
                                                {(data?.images ?? []).map(img_url =>
                                                (<Grid item xs={4} sm={3} key={img_url}>
                                                    <img style={{ width: '100%', cursor: "pointer" }} alt={data?.title} src={img_url} onClick={() => setSrcMainImage(img_url)} />
                                                </Grid>)
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="h5"><Typography variant="h5" fontWeight="bold" display="inline">Price : </Typography>{(data?.price ?? 0).toLocaleString("en-US")}</Typography>
                                                    <Rating size="large" value={data?.rating ?? 0} readOnly />
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography><Typography fontWeight="bold" display="inline">Category : </Typography>{data?.category}</Typography>
                                                    <Typography><Typography fontWeight="bold" display="inline">Brand : </Typography>{data?.brand}</Typography>
                                                </Box>
                                                <Typography><Typography fontWeight="bold" display="inline">Stock : </Typography>{data?.stock}</Typography>
                                                <Typography fontWeight="bold" display="inline">Description :</Typography>
                                                <Typography>{data?.description}</Typography>
                                            </Box>
                                        </Grid>
                                    </>)
                            )
                    }
                </Grid>
            </DialogContent>
        </Dialog>
    </>)
}

export default Soal2