import { useState } from 'react';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';

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
    <Box component="form" onSubmit={(e) => handleSubmit(e)} px={2} margin={4}>
      <Stack gap={2}>
        <Typography variant="h6" component="div">
          Make A Facility Report
        </Typography>
        <TextField
          label="Title"
          name="title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </Box>
  );
}
