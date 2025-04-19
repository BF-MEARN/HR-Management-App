import { Paper } from "@mui/material"
import { useState } from "react"
import FacilityReport from "./FacilityReport";
import HousingDetails from "./HousingDetails";
import FacilityReportForm from "./FacilityReportForm";

export interface Report {
    id: string;
    title: string;
    description: string;
}

export default function HousingPage () {
    const [formTitle, setFormTitle] = useState<string>('');
    const [formDescription, setFormDescription] = useState<string>('');
    const [reports, setReports] = useState<Report[]>([]);

    return (
        <>
            <HousingDetails />
            <FacilityReportForm 
                formTitle={formTitle}
                formDescription={formDescription} 
                setFormTitle={setFormTitle} 
                setFormDescription={setFormDescription} 
                setReports={setReports}
            />
            {/* List of Existing/Past Facility Reports */}
            <Paper>
                <h1>Existing/Past Reports</h1>
                {reports.map((report, index) => (
                    <FacilityReport 
                        key={report.id} 
                        index={index} 
                        title={report.title} 
                        description={report.description} 
                        setReports={setReports}
                    />
                ))}
            </Paper>
        </>
    )
}