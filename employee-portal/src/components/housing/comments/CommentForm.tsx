import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import { useAppDispatch } from '../../../store';
import { addComment } from '../../../store/slices/facilityReportSlice';
import { api } from '../../../utils/utils';

export default function CommentForm({ reportId }: { reportId: string; status: string }) {
  const [create, setCreate] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setCreate(() => false);
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api(`/employee/facilityReport/${reportId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        commentDescription: description,
      }),
    });
    const { newComment, commenter } = await res.json();
    newComment.createdBy = commenter;
    dispatch(addComment({ reportId, newComment }));
    handleCancel();
  };

  const handleTurnOnCreate = () => {
    setCreate(() => true);
  };

  return (
    <>
      <Button onClick={handleTurnOnCreate}>Reply</Button>
      <Dialog
        open={create}
        onClose={handleCancel}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 1 }}
            autoFocus
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
