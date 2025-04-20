import { Box, Button, Typography } from '@mui/material';

const AcceptedTypes = {
  image: 'image/png,image/jpeg',
  document: 'application/pdf,image/png,image/jpeg',
  any: '*',
};
export interface FileUploadWithPreviewProps {
  file?: File | string;
  buttonText: string;
  onFileSelect?: (file: File) => void;
  type: keyof typeof AcceptedTypes;
  width?: string;
  height?: string;
}

export default function FileUploadWithPreview({
  file,
  buttonText,
  onFileSelect,
  type = 'any',
  width = '200px',
  height = '200px',
}: FileUploadWithPreviewProps) {
  const accept = AcceptedTypes[type];
  const renderContent = () => {
    if (!file) {
      return (
        <Typography variant="body2" color="textSecondary">
          No file uploaded
        </Typography>
      );
    }

    const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    if (type == 'image') {
      return (
        <img
          src={fileUrl}
          alt="Preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }

    return <Typography variant="body2">File uploaded</Typography>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <Box
        sx={{
          width,
          height,
          border: '1px dashed #ccc',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#f9f9f9',
          position: 'relative',
        }}
      >
        {renderContent()}
      </Box>
      <Button variant="outlined" component="label">
        {buttonText}
        <input
          type="file"
          hidden
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onFileSelect) {
              onFileSelect(file);
            }
          }}
        />
      </Button>
    </Box>
  );
}
