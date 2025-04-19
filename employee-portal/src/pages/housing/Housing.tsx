import { Box, Button, Paper, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { v4 as randomId } from 'uuid';
import FacilityReport from "./FacilityReport";

const house = {
    address: {
        num: "{1234}",
        street: "{Street}",
        city: "{City}",
        state: "{State}",
        zip: "{ZIP}"
    },
    roommates: {
        person1: {
            first_name: 'John',
            last_name: 'Doe',
            middle_name: 'Unknown',
            phone: '(123) 456-7890'
        },
        person2: {
            first_name: 'Susan',
            last_name: 'B',
            middle_name: 'Anthony',
            preferred_name: 'Jane Doe',
            phone: '(345) 678-8646'
        }
    }
}

export interface Report {
    id: string;
    title: string;
    description: string;
}

export default function Housing () {
    const [formTitle, setFormTitle] = useState<string>('');
    const [reportDescription, setReportDescription] = useState<string>('');
    const [reports, setReport] = useState<Report[]>([]);

    useEffect(() => {
        console.log(reports);
    }, [reports])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setReport(prevReports => [...prevReports, { id: randomId(), title: formTitle, description: reportDescription }])
        setFormTitle('');
        setReportDescription('');
    }
    return (
        <>
        {/* Housing Details */}
            <Paper>
                <Box>
                    <h1>Housing Details</h1>
                    <h2>Address</h2>
                    <h3>{Object.values(house.address).join(' ')}</h3>
                    <h2>Roommates</h2>
                    {Object.values(house.roommates).map(person => (
                        <h3 key={person.phone}>
                            {'preferred_name' in person ? `${person.preferred_name}, ` : `${person.first_name} ${person.middle_name} ${person.last_name}, `}
                            {person.phone}
                        </h3>
                    ))}
                </Box>
            </Paper>
        {/* Facility Report Form */}
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
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        fullWidth
                    />
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </Paper>
        {/* List of Existing/Past Facility Reports */}
            <Paper>
                <h1>Existing/Past Reports</h1>
                {reports.map((report, index) => (
                    <FacilityReport 
                        key={report.id} 
                        index={index} 
                        title={report.title} 
                        description={report.description} 
                        setReport={setReport}
                    />
                ))}
            </Paper>
        </>
    )
}