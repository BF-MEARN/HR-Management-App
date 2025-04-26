import React, { useState } from 'react';

import { Button, TextField } from '@mui/material';

import { useAppDispatch } from '../../../store';
import { addComment } from '../../../store/slices/facilityReportSlice';
// import { v4 as randomId } from 'uuid';

// import { Report } from '../../../pages/Housing';

import { api } from '../../../utils/utils';

export default function CommentForm({ reportId, status }: { reportId: string; status: string }) {
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
      {status !== 'Closed' && (
        <>
          {create ? (
            <form onSubmit={(e) => handleSubmit(e)}>
              <TextField
                label="Description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
              />
              <Button type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </form>
          ) : (
            <Button onClick={handleTurnOnCreate}>Reply</Button>
          )}
        </>
      )}
    </>
  );
}
