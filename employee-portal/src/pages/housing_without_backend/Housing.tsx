import { useState } from 'react';

import { Paper } from '@mui/material';

import ExistingFacilityReport from './ExistingFacilityReport';
import FacilityReportForm from './FacilityReportForm';
import HousingDetails from './HousingDetails';

export interface Report {
  id: string;
  title: string;
  description: string;
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
            setReports={setReports}
          />
        ))}
      </Paper>
    </>
  );
}
