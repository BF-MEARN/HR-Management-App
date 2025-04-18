import { memo, useState } from 'react';

import { Button, TextField } from '@mui/material';

import { Report } from './Housing';

interface ExistingFacilityReportProps {
  index: number;
  title: string;
  description: string;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

const ExistingFacilityReport = ({
  index,
  title,
  description,
  setReports,
}: ExistingFacilityReportProps) => {
  const [currTitle, setTitle] = useState(title);
  const [currDescription, setDescription] = useState(description);
  const [edit, setEdit] = useState(false);

  const handleCancel = () => {
    setEdit(() => false);
    setTitle(() => title);
    setDescription(() => description);
  };

  const handleDelete = (index: number) => {
    setReports((prevReports) => {
      const splicedReports = [...prevReports];
      splicedReports.splice(index, 1);
      console.log(splicedReports);
      return splicedReports;
    });
  };

  const handleEdit = () => {
    setEdit(() => true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, index: number) => {
    e.preventDefault();
    setReports((prevReports) => {
      const editedReports = [...prevReports];
      editedReports[index].title = currTitle;
      editedReports[index].description = currDescription;
      return editedReports;
    });
    setEdit(() => false);
  };

  return (
    <>
      {!edit ? (
        <>
          <h2>{currTitle}</h2>
          <p>{currDescription}</p>
          <Button onClick={() => handleDelete(index)}>Delete</Button>
          <Button onClick={handleEdit}>Edit</Button>
        </>
      ) : (
        <form onSubmit={(e) => handleSubmit(e, index)}>
          <TextField
            label="Title"
            name="title"
            value={currTitle}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            name="description"
            value={currDescription}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      )}
    </>
  );
};

export default memo(ExistingFacilityReport);
