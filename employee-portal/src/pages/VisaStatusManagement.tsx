import { useEffect, useState } from 'react';

import { Button, Paper, Typography } from '@mui/material';
import axios from 'axios';

const VisaStatusManagementPage = () => {
  interface UserData {
    _id: string;
    [key: string]: unknown;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [userVisaStatus, setUserVisaStatus] = useState<VisaStatus | null>(null);

  interface VisaStatus {
    optReceipt: {
      status: string;
      feedback?: string;
    };
    optEAD: {
      status: string;
      feedback?: string;
    };
    i983: {
      status: string;
      feedback?: string;
    };
    i20: {
      status: string;
      feedback?: string;
    };
    employeeId: string;
    workAuthorization: {
      type: string;
    };
  }

  const fetchUserData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/personal-info', {
        withCredentials: true,
      });

      setUserData(res.data.employee);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVisaStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/onboarding/visa-status?_id=${userData?._id}`
      );

      setUserVisaStatus(res.data.visaStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (fileType: string) => {

    if (!file) {
      alert('No file uploaded')
      return
    }

    const formData = new FormData();
    formData.append(fileType, file); // make sure 'file' matches your backend key

    try {
      const res = await axios.put('http://localhost:3000/api/personal-info/documents', formData, {
        withCredentials: true,
      });

      if (res.status === 200) {

        const updateData = {
          _id: userData?._id,
          documentUpdate: {
            type: fileType.slice(0, fileType.length - 4)
          }
        }

        try {
          await axios.patch("http://localhost:3000/api/onboarding/update-visa", updateData)
          fetchUserData()
        } catch (error) {
          console.log(error)
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  useEffect(() => {
    if (userData?._id) {
      fetchVisaStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <>
      <Typography variant="h4" style={{ marginBottom: '5vh' }}>
        Visa Status Management
      </Typography>
      <Paper
        style={{
          marginBottom: '10px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          height: '20vh',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography variant="h5">1. OPT Receipt</Typography>
        {(() => {
          switch (userVisaStatus?.optReceipt.status) {
            case 'Not Uploaded':
              //add onclick to button that runs upload document function
              return (
                <div>
                  <input
                    accept="*"
                    id="file-upload"
                    type="file"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" component="span">
                      Upload File
                    </Button>
                  </label>
                  {file && (
                    <>
                      <p>File selected: {file.name}</p>
                      <Button variant="contained" onClick={() => handleUpload("optReceiptFile")}>Submit</Button>
                    </>
                  )}
                </div>
              );
            case 'Pending Approval':
              return (
                <>
                  <div style={{ color: "#FDD835", fontWeight: 600 }}>Waiting for HR to approve your OPT Receipt</div>
                </>
              );
            case 'Approved':
              return (
                <>
                  <div style={{ color: "#16A34A", fontWeight: 600 }}>Approved. Please download and fill out the OPT-EAD form.</div>
                </>
              );
            case 'Rejected':
              return (
                <>
                  <div style={{ color: "#FF0000", fontWeight: 600 }}>Rejected. {userVisaStatus.optReceipt.feedback}</div>
                  <div>
                    <input
                      accept="*"
                      id="file-upload"
                      type="file"
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span">
                        Upload File
                      </Button>
                    </label>
                    {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("optReceiptFile")}>Submit</Button></>}
                  </div>
                </>
              );
            default:
              return null;
          }
        })()}
      </Paper>
      <Paper
        style={{
          marginBottom: '10px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          height: '20vh',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography variant="h5">2. OPT EAD</Typography>
        {(() => {
          switch (userVisaStatus?.optEAD.status) {
            case 'Not Uploaded':
              return (
                <div>
                  {userVisaStatus?.optReceipt.status === 'Approved' ? (
                    <div>
                      <input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="contained" component="span">
                          Upload File
                        </Button>
                      </label>
                      {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("optEADFile")}>Submit</Button></>}
                    </div>
                  ) : (
                    <>
                      <div>Please submit OPT Receipt before uploading this document.</div>
                      <input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleChange}
                        style={{ display: 'none' }}

                      />
                      <label htmlFor="file-upload">
                        <Button variant="contained" component="span" disabled>
                          Upload File
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              );
            case 'Pending Approval':
              return (
                <>
                  <div style={{ color: "#FDD835", fontWeight: 600 }}>Waiting for HR to approve your OPT receipt</div>
                </>
              );
            case 'Approved':
              return (
                <>
                  <div style={{ color: "#16A34A", fontWeight: 600 }}>Please download and fill out the I-983 form</div>
                </>
              );
            case 'Rejected':
              return (
                <>
                  <div style={{ color: "#FF0000", fontWeight: 600 }}>Rejected. {userVisaStatus.optEAD.feedback}</div>
                  <div>
                    <input
                      accept="*"
                      id="file-upload"
                      type="file"
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span">
                        Upload File
                      </Button>
                    </label>
                    {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("optEADFile")}>Submit</Button></>}
                  </div>
                </>
              );
            default:
              return null;
          }
        })()}
      </Paper>
      <Paper
        style={{
          marginBottom: '10px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          height: '20vh',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography variant="h5">3. I-983</Typography>
        {(() => {
          switch (userVisaStatus?.i983.status) {
            case 'Not Uploaded':
              return (
                <div>
                  {userVisaStatus?.optEAD.status === 'Approved' ? (
                    <div>
                      <input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="contained" component="span" >
                          Upload File
                        </Button>
                      </label>
                      {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("i983File")}>Submit</Button></>}
                    </div>
                  ) : (
                    <>
                      <div>Please submit OPT EAD before uploading this document.</div>
                      <input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="contained" component="span" disabled>
                          Upload File
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              );
            case 'Pending Approval':
              return (
                <>
                  <div style={{ color: "#FDD835", fontWeight: 600 }}>Waiting for HR to approve
                    and sign your I-983</div>
                </>
              );
            case 'Approved':
              return (
                <>
                  <div style={{ color: "#16A34A", fontWeight: 600 }}>Approved. Please send the I-983 along with all necessary documents to your school and upload the new I-20</div>
                </>
              );
            case 'Rejected':
              return (
                <>
                  <div style={{ color: "#FF0000", fontWeight: 600 }}>Rejected. {userVisaStatus.i983.feedback}</div>
                  <div>
                    <input
                      accept="*"
                      id="file-upload"
                      type="file"
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span">
                        Upload File
                      </Button>
                    </label>
                    {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("i983File")}>Submit</Button></>}
                  </div>
                </>
              );
            default:
              return null;
          }
        })()}
      </Paper>
      <Paper
        style={{
          marginBottom: '10px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          height: '20vh',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography variant="h5">4. I-20</Typography>
        {(() => {
          switch (userVisaStatus?.i20.status) {
            case 'Not Uploaded':
              return (
                <div>
                  {userVisaStatus?.i983.status === 'Approved' ? (
                    <div>
                      <input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="contained" component="span">
                          Upload File
                        </Button>
                      </label>
                      {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("i20File")}>Submit</Button></>}
                    </div>
                  ) : (
                    <>
                      <div>Please submit I-983 before uploading this document.</div>
                      <input
                        accept="*"
                        id="file-upload"
                        type="file"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="contained" component="span" disabled>
                          Upload File
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              );
            case 'Pending Approval':
              return (
                <>
                  <div style={{ color: "#FDD835", fontWeight: 600 }}>Waiting for HR to approve your I-20</div>
                </>
              );
            case 'Approved':
              return (
                <>
                  <div style={{ color: "#16A34A", fontWeight: 600 }}>All documents have been approved.</div>
                </>
              );
            case 'Rejected':
              return (
                <>
                  <div style={{ color: "#FF0000", fontWeight: 600 }}>Rejected. {userVisaStatus.i20.feedback}</div>
                  <div>
                    <input
                      accept="*"
                      id="file-upload"
                      type="file"
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="contained" component="span">
                        Upload File
                      </Button>
                    </label>
                    {file && <><p>File selected: {file.name}</p><Button variant="contained" onClick={() => handleUpload("i20File")}>Submit</Button></>}
                  </div>
                </>
              );
            default:
              return null;
          }
        })()}
      </Paper>
    </>
  );
};

export default VisaStatusManagementPage;
