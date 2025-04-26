import { useState } from 'react';

import { Button, Paper, TextField } from '@mui/material';

import { useAppDispatch } from '../../../store';
import { createReport } from '../../../store/slices/facilityReportSlice';
import { api } from '../../../utils/utils';

export default function FacilityReportForm({ houseId }: { houseId: string }) {
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api(`/employee/facilityReport/house/${houseId}/create`, {
      method: 'POST',
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
      }),
    });
    const {
      facility_report: { _id, title, description, status, comments, createdAt, updatedAt },
    } = await res.json();
    dispatch(createReport({ _id, title, description, status, comments, createdAt, updatedAt }));
    setFormTitle('');
    setFormDescription('');
  };

  return (
    <Paper>
      <h1>Make A Facility Report</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField
          label="Title"
          name="title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          required
        />
        <br />
        <TextField
          label="Description"
          name="description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit">Submit</Button>
      </form>
    </Paper>
  );
}
