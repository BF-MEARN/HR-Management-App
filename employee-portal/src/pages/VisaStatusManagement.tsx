import { useEffect, useState } from 'react';

import {
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  ErrorOutline as ErrorOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import axios from 'axios';

import FileUploadWithPreview from '../components/FileUploadWithPreview';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEmployeeData } from '../store/slices/employeeSlice';

interface UploadComponentProps {
  fileType: string;
  isDisabled?: boolean;
  disabledMessage?: string;
}

interface DocumentStepProps {
  title: string;
  status: string;
  feedback?: string;
  fileType: string;
  isDisabled?: boolean;
  disabledMessage?: string;
}

const VisaStatusManagementPage = () => {
  const userData = useAppSelector((state) => state.employee.employee);
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const userVisaStatus = userData?.visaInfo;
  const [activeStep, setActiveStep] = useState(0);

  const fetchUserData = () => {
    dispatch(fetchEmployeeData());
  };

  useEffect(() => {
    if (userVisaStatus) {
      if (userVisaStatus.i20.status === 'Approved') {
        setActiveStep(4); // All complete
      } else if (userVisaStatus.i983.status === 'Approved') {
        setActiveStep(3); // I-20 is next
      } else if (userVisaStatus.optEAD.status === 'Approved') {
        setActiveStep(2); // I-983 is next
      } else if (userVisaStatus.optReceipt.status === 'Approved') {
        setActiveStep(1); // OPT EAD is next
      } else {
        setActiveStep(0); // OPT Receipt is next
      }
    }
  }, [userVisaStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (fileType: string) => {
    if (!file) {
      alert('No file uploaded');
      return;
    }

    const formData = new FormData();
    formData.append(fileType, file);

    try {
      const res = await axios.put(
        'http://localhost:3000/api/employee/personal-info/documents',
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updateData = {
          _id: userData?._id,
          documentUpdate: {
            type: fileType.slice(0, fileType.length - 4),
            status: 'Pending Approval',
          },
        };

        try {
          await axios.patch(
            'http://localhost:3000/api/employee/onboarding/update-visa',
            updateData,
            {
              withCredentials: true,
            }
          );
          fetchUserData();
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const downloadTemplate = async (templateType: 'empty' | 'sample') => {
    try {
      const fileName = templateType === 'empty' ? 'Empty_Template.pdf' : 'Sample_Template.pdf';

      // Request a presigned URL with the asAttachment parameter
      const response = await axios.get(
        `http://localhost:3000/api/employee/docs/template-download`,
        {
          params: {
            template: fileName,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.url) {
        // Open the presigned URL to trigger download
        window.open(response.data.url, '_blank');
      } else {
        throw new Error('Failed to get download URL');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download template. Please try again later.');
    }
  };

  // Helper function to determine status chip color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          color: 'success',
          icon: <CheckCircleIcon />,
          label: 'Approved',
          textColor: 'text-green-600',
        };
      case 'Pending Approval':
        return {
          color: 'warning',
          icon: <HourglassEmptyIcon />,
          label: 'Pending Approval',
          textColor: 'text-amber-500',
        };
      case 'Rejected':
        return {
          color: 'error',
          icon: <ErrorOutlineIcon />,
          label: 'Rejected',
          textColor: 'text-red-600',
        };
      case 'Not Uploaded':
      default:
        return {
          color: 'default',
          icon: <RadioButtonUncheckedIcon />,
          label: 'Not Uploaded',
          textColor: 'text-gray-500',
        };
    }
  };

  // Upload component for reuse
  const UploadComponent = ({
    fileType,
    isDisabled = false,
    disabledMessage = '',
  }: UploadComponentProps) => (
    <div className="mt-4 space-y-4">
      {isDisabled && (
        <Alert severity="info" className="mb-4">
          {disabledMessage}
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          accept="*"
          id={`file-upload-${fileType}`}
          type="file"
          onChange={handleChange}
          className="hidden"
          disabled={isDisabled}
        />
        <label htmlFor={`file-upload-${fileType}`}>
          <Button
            variant="outlined"
            component="span"
            disabled={isDisabled}
            startIcon={<CloudUploadIcon />}
            className="normal-case"
          >
            Select File
          </Button>
        </label>
        {file && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="text-sm py-1 px-2 bg-gray-100 rounded-md">{file.name}</div>
            <Button
              variant="contained"
              onClick={() => handleUpload(fileType)}
              color="primary"
              size="small"
              className="normal-case"
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Document step content reusable component
  const DocumentStep = ({
    title,
    status,
    feedback,
    fileType,
    isDisabled = false,
    disabledMessage = '',
  }: DocumentStepProps) => {
    const statusInfo = getStatusInfo(status);
    const isI983 = title === 'I-983';

    return (
      <Box sx={{ mb: 3 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <Typography variant="h6" component="div" className="font-medium">
            {title}
          </Typography>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={
              statusInfo.color as
                | 'primary'
                | 'secondary'
                | 'error'
                | 'success'
                | 'warning'
                | 'info'
                | undefined
            }
            variant="outlined"
            size="small"
            className="mt-2 md:mt-0"
          />
        </div>

        <div className="my-4">
          {status === 'Approved' && (
            <Alert severity="success">
              {title === 'OPT Receipt' &&
                'Approved. Please download and fill out the OPT-EAD form.'}
              {title === 'OPT EAD' && 'Approved. Please download and fill out the I-983 form.'}
              {title === 'I-983' &&
                'Approved. Please send the I-983 along with all necessary documents to your school and upload the new I-20.'}
              {title === 'I-20' && 'All documents have been approved.'}
            </Alert>
          )}

          {status === 'Pending Approval' && (
            <Alert severity="warning">
              Waiting for HR to {title === 'I-983' ? 'approve and sign your' : 'approve your'}{' '}
              {title}
            </Alert>
          )}

          {status === 'Rejected' && <Alert severity="error">Rejected. {feedback}</Alert>}
        </div>

        {/* I-983 Template Download Section */}
        {isI983 && (status === 'Not Uploaded' || status === 'Rejected') && (
          <Paper
            elevation={2}
            className="p-5 mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500"
          >
            <Typography variant="h6" className="font-medium text-indigo-800 mb-3">
              Download I-983 Templates
            </Typography>
            <Typography variant="body2" className="mb-4 text-gray-700">
              Before submitting your I-983 form, please download both templates below. Use the
              sample template as a reference to correctly fill out the empty template.
            </Typography>
            <div className="flex flex-wrap gap-3 mb-2 mt-3">
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => downloadTemplate('empty')}
                size="medium"
                className="bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                Empty Template
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={() => downloadTemplate('sample')}
                size="medium"
                className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
              >
                Sample Template
              </Button>
            </div>
          </Paper>
        )}

        {(status === 'Not Uploaded' || status === 'Rejected') && (
          <>
            <Box sx={{ display: 'none' }}>
              <UploadComponent
                fileType={fileType}
                isDisabled={isDisabled}
                disabledMessage={disabledMessage}
              />
            </Box>
            <FileUploadWithPreview
              type="document"
              previewOnly={isDisabled}
              fileName={file?.name}
              previewURL={file ? URL.createObjectURL(file) : undefined}
              onFileSelect={(f) => {
                setFile(f);
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleUpload(fileType)}
              color="primary"
              disabled={isDisabled}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    );
  };

  return (
    <div className="max-w-[1000px] mx-auto px-2 py-4">
      <div className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
          Visa Status
        </Typography>
        <Divider />
      </div>

      <Card elevation={2} className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-[20px]">
        <CardContent>
          <p className="mb-4 font-semibold text-2xl text-indigo-800">OPT/CPT Status Tracker</p>

          <Stepper activeStep={activeStep} orientation="vertical" className="mb-4">
            <Step>
              <StepLabel>OPT Receipt</StepLabel>
              <StepContent>
                <DocumentStep
                  title="OPT Receipt"
                  status={userVisaStatus?.optReceipt.status || 'Not Uploaded'}
                  feedback={userVisaStatus?.optReceipt.feedback}
                  fileType="optReceiptFile"
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel>OPT EAD</StepLabel>
              <StepContent>
                <DocumentStep
                  title="OPT EAD"
                  status={userVisaStatus?.optEAD.status || 'Not Uploaded'}
                  feedback={userVisaStatus?.optEAD.feedback}
                  fileType="optEADFile"
                  isDisabled={userVisaStatus?.optReceipt.status !== 'Approved'}
                  disabledMessage="Please submit OPT Receipt before uploading this document."
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel>I-983</StepLabel>
              <StepContent>
                <DocumentStep
                  title="I-983"
                  status={userVisaStatus?.i983.status || 'Not Uploaded'}
                  feedback={userVisaStatus?.i983.feedback}
                  fileType="i983File"
                  isDisabled={userVisaStatus?.optEAD.status !== 'Approved'}
                  disabledMessage="Please submit OPT EAD before uploading this document."
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel>I-20</StepLabel>
              <StepContent>
                <DocumentStep
                  title="I-20"
                  status={userVisaStatus?.i20.status || 'Not Uploaded'}
                  feedback={userVisaStatus?.i20.feedback}
                  fileType="i20File"
                  isDisabled={userVisaStatus?.i983.status !== 'Approved'}
                  disabledMessage="Please submit I-983 before uploading this document."
                />
              </StepContent>
            </Step>
          </Stepper>

          {/* Summary card view for quick status */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'OPT Receipt', status: userVisaStatus?.optReceipt.status || 'Not Uploaded' },
              { title: 'OPT EAD', status: userVisaStatus?.optEAD.status || 'Not Uploaded' },
              { title: 'I-983', status: userVisaStatus?.i983.status || 'Not Uploaded' },
              { title: 'I-20', status: userVisaStatus?.i20.status || 'Not Uploaded' },
            ].map((doc) => {
              const statusInfo = getStatusInfo(doc.status);

              return (
                <div
                  key={doc.title}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle1" className="font-medium">
                      {doc.title}
                    </Typography>
                    <div className={`flex items-center ${statusInfo.textColor}`}>
                      {statusInfo.icon}
                      <span className="ml-1 text-sm font-medium">{doc.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisaStatusManagementPage;
