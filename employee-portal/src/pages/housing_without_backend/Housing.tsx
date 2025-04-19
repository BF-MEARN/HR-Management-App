import { Paper } from "@mui/material"
import { useState } from "react"
import ExistingFacilityReport from "./reports/ExistingFacilityReport";
import HousingDetails from "./HousingDetails";
import FacilityReportForm from "./reports/FacilityReportForm";

export interface Comment {
    id: string;
    description: string;
    timestamp: Date;
}

export interface Report {
    id: string;
    title: string;
    description: string;
    timeframe: Date;
    comments: Comment[]
}

export default function HousingPage() {
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
                    <ExistingFacilityReport 
                        key={report.id} 
                        index={index} 
                        title={report.title} 
                        description={report.description} 
                        timeframe={report.timeframe}
                        comments={report.comments}
                        setReports={setReports}
                    />
                ))}
            </Paper>
        </>
    )
}
