import { Button, Paper, TextField } from "@mui/material"
import { v4 as randomId } from 'uuid';
import { Report } from "./Housing";

interface FacilityReportFormProps {
    formTitle: string;
    setFormTitle: React.Dispatch<React.SetStateAction<string>>;
    formDescription: string;
    setFormDescription: React.Dispatch<React.SetStateAction<string>>;
    setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function FacilityReportForm (
    { 
        formTitle, 
        setFormTitle, 
        formDescription, 
        setFormDescription, 
        setReports 
    }: FacilityReportFormProps
) 
{
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setReports((prevReports: Report[]): Report[] => [...prevReports, { id: randomId(), title: formTitle, description: formDescription }])
        setFormTitle('');
        setFormDescription('');
    }

    return (
        <Paper>
            <h1>Make A Facility Report</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <TextField
                    label="Title"
                    name="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                />
                <br/>
                <TextField
                    label="Description"
                    name="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    fullWidth
                />
                <Button type="submit">
                    Submit
                </Button>
            </form>
        </Paper>
    )
}