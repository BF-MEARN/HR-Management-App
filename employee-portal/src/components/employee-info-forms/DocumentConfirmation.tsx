import { Box, Typography } from '@mui/material';

import { useAppSelector } from '../../store';
import FileUploadWithPreview from '../FileUploadWithPreview';

export default function DocumentConfirmation() {
  const profilePicture = {
    name: useAppSelector((state) => state.employeeForm.personalInfo.profilePictureFileName),
    url: useAppSelector((state) => state.employeeForm.personalInfo.profilePicturePreview),
  };
  const driverLicense = {
    name: useAppSelector((state) => state.employeeForm.driverAndCar.driverLicense.licenseFileName),
    url: useAppSelector((state) => state.employeeForm.driverAndCar.driverLicense.licensePreview),
  };
  const authDocument = {
    name: useAppSelector((state) => state.employeeForm.workAuth.extraAuthInfo.f1DocumentName),
    url: useAppSelector((state) => state.employeeForm.workAuth.extraAuthInfo.f1DocumentPreview),
  };

  return (
    <>
      <Box>
        <Box>
          <Typography variant="h6" mt={4} mb={1}>
            Profile Picture
          </Typography>
          {!profilePicture.name ? (
            <Typography variant="body1">Nothing uploaded</Typography>
          ) : (
            <FileUploadWithPreview
              previewOnly
              previewURL={profilePicture.url}
              fileName={profilePicture.name}
              type="image"
            />
          )}
        </Box>
        <Box>
          <Typography variant="h6" mt={4} mb={1}>
            Driver&apos;s License
          </Typography>
          {!driverLicense.name ? (
            <Typography variant="body1">Nothing uploaded</Typography>
          ) : (
            <FileUploadWithPreview
              previewOnly
              height="2rem"
              previewURL={driverLicense.url}
              fileName={driverLicense.name}
              type="document"
            />
          )}
        </Box>
        <Box>
          <Typography variant="h6" mt={4} mb={1}>
            Work Authorization Documents
          </Typography>
          {!authDocument.name ? (
            <Typography variant="body1">Nothing uploaded</Typography>
          ) : (
            <FileUploadWithPreview
              previewOnly
              height="2rem"
              previewURL={authDocument.url}
              fileName={authDocument.name}
              type="document"
            />
          )}
        </Box>
      </Box>
    </>
  );
}
