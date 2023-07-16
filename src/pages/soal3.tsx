import { Container, Grid, Card, CardContent, CardActions, TextField, Button, Snackbar, Alert } from "@mui/material"
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs"
import { useState, FormEvent } from "react"
interface Data {
    no_pesanan: string,
    tanggal: Dayjs | null,
    nm_supplier: string,
    nm_produk: string,
    total: number | string
}
interface DataError {
    no_pesanan?: string,
    tanggal?: string,
    nm_supplier?: string,
    nm_produk?: string,
    total?: string
}

const Soal3 = () => {
    const [data, setData] = useState<Data>({
        no_pesanan: "",
        tanggal: dayjs(new Date()),
        nm_supplier: "", nm_produk: "",
        total: ""
    })
    const [error, setError] = useState<DataError | undefined>()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const onFormSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (isLoading === true) return
        const tmpData = {
            ...data,
            tanggal: (data.tanggal ?? dayjs(new Date())).format('YYYY-MM-DD'),
            total: typeof data.total === 'number' ? data.total : parseFloat(data.total)
        }
        setError(undefined)
        setIsError(false)
        setLoading(true)
        try {
            const res = await fetch(
                ((window as any)?.REACT_APP_API_URL ?? "") + "/api/soal3",
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(tmpData)
                }
            )
            setLoading(false)
            if (res.status === 201) setIsSuccess(true)
            else if (res.status === 400) setError((await res.json())?.data)
            else setIsError(true)
        } catch (err) {
            console.log(err)
            setIsError(true)
            setLoading(false)
        }
    }

    return (<>
        <Container>
            <Grid container mt={2} mx={2}>
                <Grid item xs={12} sm={6}>
                    <form onSubmit={onFormSubmit}>
                        <Card>
                            <CardContent>
                                <Grid item xs={6}>
                                    <TextField
                                        label="No. Pesanan"
                                        value={data.no_pesanan}
                                        onChange={e => setData(d => ({ ...d, no_pesanan: e.target.value }))}
                                        error={typeof error?.no_pesanan === 'string' && error.no_pesanan.length > 0}
                                        helperText={typeof error?.no_pesanan === 'string' && error.no_pesanan.length > 0 ? error.no_pesanan : ""}
                                        margin="dense"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            value={data.tanggal}
                                            onChange={(tanggal) => setData(d => ({ ...d, tanggal }))}
                                            slotProps={{
                                                textField: {
                                                    label: "Tanggal",
                                                    margin: "dense",
                                                    fullWidth: true,
                                                    error: typeof error?.tanggal === 'string' && error.tanggal.length > 0,
                                                    helperText: typeof error?.tanggal === 'string' && error.tanggal.length > 0 ? error.tanggal : ""
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Nama Supplier"
                                        value={data.nm_supplier}
                                        onChange={e => setData(d => ({ ...d, nm_supplier: e.target.value }))}
                                        error={typeof error?.nm_supplier === 'string' && error.nm_supplier.length > 0}
                                        helperText={typeof error?.nm_supplier === 'string' && error.nm_supplier.length > 0 ? error.nm_supplier : ""}
                                        margin="dense"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Nama Produk"
                                        value={data.nm_produk}
                                        onChange={e => setData(d => ({ ...d, nm_produk: e.target.value }))}
                                        error={typeof error?.nm_produk === 'string' && error.nm_produk.length > 0}
                                        helperText={typeof error?.nm_produk === 'string' && error.nm_produk.length > 0 ? error.nm_produk : ""}
                                        margin="dense"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        label="Total"
                                        value={data.total}
                                        onChange={e => setData(d => {
                                            if (e.target.value.length === 0)
                                                return { ...d, total: "" }
                                            if (e.target.value.length === 1 && e.target.value === "-")
                                                return { ...d, total: e.target.value }
                                            if (/^[-][0]+$/.test(e.target.value))
                                                return { ...d, total: "-0" }
                                            if (/^[-]?[0-9]+[.][0]+$/.test(e.target.value))
                                                return { ...d, total: e.target.value }
                                            if (/^[-]?[0-9]+([.][0-9]+)?$/.test(e.target.value))
                                                return { ...d, total: parseFloat(e.target.value) }
                                            if (
                                                e.target.value[e.target.value.length - 1] === "." &&
                                                e.target.value.indexOf(".") === (e.target.value.length - 1)
                                            ) return { ...d, total: e.target.value }
                                            return { ...d }
                                        })}
                                        error={typeof error?.total === 'string' && error.total.length > 0}
                                        helperText={typeof error?.total === 'string' && error.total.length > 0 ? error.total : ""}
                                        margin="dense"
                                        fullWidth
                                    />
                                </Grid>
                            </CardContent>
                            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" type="submit">Simpan</Button>
                            </CardActions>
                        </Card>
                    </form>
                </Grid>
            </Grid>
        </Container>
        <Snackbar open={isSuccess} autoHideDuration={5000} onClose={() => setIsSuccess(false)}>
            <Alert onClose={() => setIsSuccess(false)} severity="success" sx={{ width: '100%' }}>
                Berhasil Tersimpan!
            </Alert>
        </Snackbar>
        <Snackbar open={isError} autoHideDuration={5000} onClose={() => setIsError(false)}>
            <Alert onClose={() => setIsError(false)} severity="error" sx={{ width: '100%' }}>
                Gagal Tersimpan!
            </Alert>
        </Snackbar>
    </>)
}
export default Soal3