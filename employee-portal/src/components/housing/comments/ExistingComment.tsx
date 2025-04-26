import { FormEvent, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import { useAppDispatch } from '../../../store';
import { Comment, deleteComment, updateComment } from '../../../store/slices/facilityReportSlice';
import { api } from '../../../utils/utils';

export default function ExistingComment({
  reportId,
  comment,
  status,
}: {
  reportId: string;
  comment: Comment;
  status: string;
}) {
  const [currDescription, setCurrDescription] = useState<string>(comment.description);
  const [edit, setEdit] = useState<boolean>(false);

  const commentTimestamp = comment && comment.timestamp && new Date(comment.timestamp);

  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setEdit(() => false);
    setCurrDescription(() => comment.description);
  };

  const handleDelete = async () => {
    const res = await api(`/employee/facilityReport/${reportId}/comments/${comment._id}/delete`, {
      method: 'DELETE',
    });
    const {
      existingComment: { _id: commentId },
    } = await res.json();
    dispatch(deleteComment({ reportId, commentId }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api(`/employee/facilityReport/${reportId}/comments/${comment._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        newDescription: currDescription,
      }),
    });

    const { newDescription, newTimestamp } = await res.json();
    console.log(newDescription, newTimestamp);
    dispatch(updateComment({ reportId, commentId: comment._id, newDescription, newTimestamp }));
    setEdit(() => false);
  };

  const handleTurnOnEdit = () => {
    setEdit(() => true);
  };

  return (
    <>
      <Card>
        <CardHeader
          avatar={<Avatar />}
          title={
            comment.createdBy &&
            `${comment.createdBy.firstName} ${comment.createdBy.lastName} commented:`
          }
          subheader={commentTimestamp.toLocaleDateString()}
        />
        <CardContent>
          <Typography variant="body1">{currDescription}</Typography>
        </CardContent>
        {status !== 'Closed' && (
          <CardActions>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleTurnOnEdit}>Edit</Button>
          </CardActions>
        )}
      </Card>
      <Dialog
        open={edit}
        onClose={handleCancel}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 1 }}
            autoFocus
            label="Description"
            name="description"
            value={currDescription}
            onChange={(e) => setCurrDescription(e.target.value)}
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
