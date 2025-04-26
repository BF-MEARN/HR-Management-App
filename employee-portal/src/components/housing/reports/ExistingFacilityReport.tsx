import { memo, useState } from 'react';

import { Box, Button, MenuItem, Modal, Select, TextField } from '@mui/material';

import { useAppDispatch } from '../../../store';
import {
  FacilityReportEntry,
  closeReport,
  deleteReport,
  updateReport,
} from '../../../store/slices/facilityReportSlice';
import { api } from '../../../utils/utils';
import CommentSection from '../comments/CommentSection';

const ExistingFacilityReport = ({ report }: { report: FacilityReportEntry }) => {
  const [currTitle, setTitle] = useState(report.title);
  const [currDescription, setDescription] = useState(report.description);
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const reportTimestamp = report && report.updatedAt && new Date(report.updatedAt);

  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setEdit(() => false);
    setTitle(() => report.title);
    setDescription(() => report.description);
  };

  const handleClose = () => {
    setOpen(() => false);
  };

  const handleCloseReport = async () => {
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

  const handleOpen = () => {
    setOpen(() => true);
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
      <hr />

      {/* Facility Report */}
      {!edit ? (
        // UnEdited Mode
        <>
          {report && report.createdAt && report.updatedAt && reportTimestamp && (
            <div style={{ fontStyle: 'italic' }}>
              {report.createdAt.toString() === report.updatedAt.toString() ? 'Created' : 'Edited'}{' '}
              on {reportTimestamp.toLocaleDateString()}, {reportTimestamp.toLocaleTimeString()}
            </div>
          )}
          <h2>
            {currTitle}
            {report.status !== 'Closed' ? (
              <>
                <Select value={report.status} sx={{ marginLeft: '20px' }}>
                  <MenuItem value={report.status}>{report.status}</MenuItem>
                  <MenuItem value={'Closed'} onClick={handleOpen}>
                    Closed
                  </MenuItem>
                </Select>

                <Modal open={open} onClose={handleClose}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      aspectRatio: 1 / 1,
                      width: 400,
                      bgcolor: 'rgb(18, 18, 18)',
                      color: 'white',
                      border: '2px solid #000',
                      borderRadius: 5,
                      boxShadow: 24,
                      pt: 2,
                      px: 4,
                      pb: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <p>Once you close the report, you can never reopen!</p>
                    <p>You can never do anything to this report from now on!</p>
                    <p>Are you sure?</p>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <Button
                        onClick={handleClose}
                        sx={{
                          backgroundColor: 'lightblue',
                          color: 'white',
                          ':hover': { backgroundColor: 'blue' },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCloseReport}
                        sx={{
                          backgroundColor: '#FFCCCB',
                          color: 'white',
                          ':hover': { backgroundColor: 'red' },
                          marginLeft: '10px',
                        }}
                      >
                        Close Report
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </>
            ) : (
              <span style={{ color: 'red', marginLeft: '10px' }}>({report.status})</span>
            )}
          </h2>
          <p>{currDescription}</p>
          {report.status !== 'Closed' && (
            <>
              <Button onClick={() => handleDelete()}>Delete</Button>
              <Button onClick={handleTurnOnEdit}>Edit</Button>
            </>
          )}
        </>
      ) : (
        // Edited Mode
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextField
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
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      )}

      <CommentSection reportId={report._id} comments={report.comments} status={report.status} />
    </>
  );
};

export default memo(ExistingFacilityReport);
