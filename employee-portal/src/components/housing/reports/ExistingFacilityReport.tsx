import { memo, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useAppDispatch } from '../../../store';
import {
  FacilityReportEntry,
  closeReport,
  deleteReport,
  updateReport,
} from '../../../store/slices/facilityReportSlice';
import { api } from '../../../utils/utils';
import CommentForm from '../comments/CommentForm';
import CommentSection from '../comments/CommentSection';

const ExistingFacilityReport = ({ report }: { report: FacilityReportEntry }) => {
  const [currTitle, setTitle] = useState(report.title);
  const [currDescription, setDescription] = useState(report.description);
  const [edit, setEdit] = useState(false);
  const [reportClosingDialogOpen, setReportClosingDialogOpen] = useState(false);

  const reportTimestamp = report && report.updatedAt && new Date(report.updatedAt);

  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setEdit(() => false);
    setTitle(() => report.title);
    setDescription(() => report.description);
  };

  const handleCloseReport = async () => {
    setReportClosingDialogOpen(false);
    api(`/employee/facilityReport/${report._id}/close`, {
      method: 'PATCH',
    });
    dispatch(closeReport({ reportId: report._id }));
  };

  const handleDelete = async () => {
    const res = await api(`/employee/facilityReport/${report._id}/delete`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const {
        facilityReport: { _id: reportId },
      } = await res.json();
      dispatch(deleteReport({ reportId }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api(`/employee/facilityReport/${report._id}/update`, {
      method: 'PUT',
      body: JSON.stringify({
        newTitle: currTitle,
        newDescription: currDescription,
      }),
    });
    const {
      facilityReport: { _id, updatedAt },
      newTitle,
      newDescription,
    } = await res.json();
    dispatch(
      updateReport({
        reportId: _id,
        newTitle,
        newDescription,
        updatedAt,
      })
    );
    setEdit(() => false);
  };

  const handleTurnOnEdit = () => {
    setEdit(() => true);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
            {report.createdAt.toString() === report.updatedAt.toString() ? 'Created' : 'Edited'} on{' '}
            {reportTimestamp.toLocaleDateString()}, {reportTimestamp.toLocaleTimeString()} -{' '}
            {report.status}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {currTitle}
          </Typography>
          <Typography gutterBottom variant="body1">
            {currDescription}
          </Typography>
        </CardContent>
        {report.status !== 'Closed' && (
          <CardActions sx={{ display: 'flex', flexDirection: 'row' }}>
            <Button onClick={() => handleDelete()}>Delete</Button>
            <Button onClick={handleTurnOnEdit}>Edit</Button>
            <CommentForm reportId={report._id} status={report.status} />
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={() => setReportClosingDialogOpen(true)} color="warning">
              Close
            </Button>
          </CardActions>
        )}

        {report.comments.length > 0 && (
          <CardContent>
            <CommentSection
              reportId={report._id}
              comments={report.comments}
              status={report.status}
            />
          </CardContent>
        )}
      </Card>
      <Dialog
        open={reportClosingDialogOpen}
        onClose={() => setReportClosingDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Close facility report?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you close the report, you can never reopen! You can never do anything to this
            report from now on!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportClosingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCloseReport} autoFocus>
            Confirm Close
          </Button>
        </DialogActions>
      </Dialog>
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
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <TextField
              sx={{ mt: 1 }}
              label="Title"
              name="title"
              value={currTitle}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              name="description"
              value={currDescription}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(ExistingFacilityReport);
