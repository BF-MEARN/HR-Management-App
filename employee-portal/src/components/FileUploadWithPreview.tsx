import { Download } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';

const AcceptedTypes = {
  image: 'image/png,image/jpeg',
  document: 'application/pdf,image/png,image/jpeg',
  any: '*',
};
export interface FileUploadWithPreviewProps {
  previewURL?: string;
  fileName?: string;
  previewOnly?: boolean;
  buttonText?: string;
  onFileSelect?: (file: File) => void;
  type: keyof typeof AcceptedTypes;
  width?: string;
  height?: string;
}

export default function FileUploadWithPreview({
  previewURL,
  fileName,
  buttonText = 'Upload File...',
  onFileSelect = () => {},
  previewOnly = false,
  type = 'any',
  width = 'auto',
  height = '2.5rem',
}: FileUploadWithPreviewProps) {
  const accept = AcceptedTypes[type];
  const renderContent = () => {
    if (!previewURL || !fileName) {
      return (
        <Typography variant="body2" color="textSecondary">
          No file uploaded
        </Typography>
      );
    }

    if (type == 'image') {
      return (
        <img
          src={previewURL}
          alt="Preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Typography>{fileName}</Typography>
        {previewOnly && (
          <IconButton
            aria-label="download"
            component="a"
            href={previewURL}
            target="_blank"
            rel="noopener noreferrer"
            download={fileName}
            size="small"
          >
            <Download />
          </IconButton>
        )}
      </Box>
    );
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
          padding: type == 'image' ? 0 : '0.3rem',
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
      {!previewOnly && (
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
      )}
    </Box>
  );
}
