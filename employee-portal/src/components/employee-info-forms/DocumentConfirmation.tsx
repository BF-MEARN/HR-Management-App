import { Box, Typography } from '@mui/material';

import { useAppSelector } from '../../store';
import FileUploadWithPreview from '../FileUploadWithPreview';

export default function DocumentConfirmation() {
  const profilePicture = useAppSelector((state) => state.employeeForm.personalInfo.profilePicture);
  const driverLicense = useAppSelector(
    (state) => state.employeeForm.driverAndCar.driverLicense.license
  );
  const authDocument = useAppSelector(
    (state) => state.employeeForm.workAuth.extraAuthInfo.optReceipt
  );

  return (
    <>
      <Box>
        <Box>
          <Typography variant="h6" mt={4} mb={1}>
            Profile Picture
          </Typography>
          {!profilePicture?.name ? (
            <Typography variant="body1">Nothing uploaded</Typography>
          ) : (
            <FileUploadWithPreview
              previewOnly
              width="200px"
              height="200px"
              previewURL={profilePicture.previewUrl}
              fileName={profilePicture.name}
              s3Key={profilePicture.s3Key}
              type="image"
            />
          )}
        </Box>
        <Box>
          <Typography variant="h6" mt={4} mb={1}>
            Driver&apos;s License
          </Typography>
          {!driverLicense?.name ? (
            <Typography variant="body1">Nothing uploaded</Typography>
          ) : (
            <FileUploadWithPreview
              previewOnly
              previewURL={driverLicense.previewUrl}
              fileName={driverLicense.name}
              s3Key={driverLicense.s3Key}
              type="document"
            />
          )}
        </Box>
        <Box>
          <Typography variant="h6" mt={4} mb={1}>
            Work Authorization Documents
          </Typography>
          {!authDocument?.name ? (
            <Typography variant="body1">Nothing uploaded</Typography>
          ) : (
            <FileUploadWithPreview
              previewOnly
              previewURL={authDocument.previewUrl}
              fileName={authDocument.name}
              s3Key={authDocument.s3Key}
              type="document"
            />
          )}
        </Box>
      </Box>
    </>
  );
}
