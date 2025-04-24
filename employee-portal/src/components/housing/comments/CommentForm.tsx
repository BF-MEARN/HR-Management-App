import React, { useState } from 'react';

import { Button, TextField } from '@mui/material';
import { v4 as randomId } from 'uuid';

import { Report } from '../../../pages/Housing';

interface CommentFormProps {
  reportIndex: number;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function CommentForm({ reportIndex, setReports }: CommentFormProps) {
  const [create, setCreate] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const handleCancel = () => {
    setCreate(() => false);
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReports((prevReports) => {
      const newReports = [...prevReports];
      const newComment = {
        id: randomId(),
        description,
        timestamp: new Date(),
      };
      newReports[reportIndex].comments = [...newReports[reportIndex].comments];
      newReports[reportIndex].comments.push(newComment);
      return newReports;
    });
    handleCancel();
  };

  const handleTurnOnCreate = () => {
    setCreate(() => true);
  };

  return (
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
  );
}
