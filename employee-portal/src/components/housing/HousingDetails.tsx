import { Fragment } from 'react/jsx-runtime';

import {
  Email as EmailIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

import { HousingState } from '../../store/slices/housingSlice';

export default function HousingDetails({ housing }: { housing: HousingState }) {
  const theme = useTheme();

  // Create a formatted address string
  const formatAddress = () => {
    const { building, street, city, state, zip } = housing.address;
    const buildingPart = building ? `${building}, ` : '';
    return `${buildingPart}${street}, ${city}, ${state} ${zip}`;
  };

  return (
    <div className="flex flex-wrap -mx-4">
      {/* Address and Landlord Section */}
      <div className="w-full md:w-7/12 px-4 mb-8 md:mb-0">
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: 'background.default',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <HomeIcon />
            <Typography variant="h6" component="div" fontWeight="bold">
              Your Address
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationIcon color="action" sx={{ mt: 0.5 }} />
                <Typography variant="body1" color="text.primary">
                  {formatAddress()}
                </Typography>
              </Box>

              {housing.landlord && housing.landlord.fullName && (
                <>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Landlord Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonIcon color="action" />
                    <Typography variant="body1">{housing.landlord.fullName}</Typography>
                  </Box>
                  {housing.landlord.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PhoneIcon color="action" />
                      <Typography variant="body1">{housing.landlord.phone}</Typography>
                    </Box>
                  )}
                  {housing.landlord.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmailIcon color="action" />
                      <Typography variant="body1">{housing.landlord.email}</Typography>
                    </Box>
                  )}
                </>
              )}

              {housing.facility && Object.keys(housing.facility).length > 0 && (
                <>
                  <Divider />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Facility Information
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {housing.facility.beds && (
                      <Chip label={`${housing.facility.beds} Beds`} size="small" />
                    )}
                    {housing.facility.mattresses && (
                      <Chip label={`${housing.facility.mattresses} Mattresses`} size="small" />
                    )}
                    {housing.facility.tables && (
                      <Chip label={`${housing.facility.tables} Tables`} size="small" />
                    )}
                    {housing.facility.chairs && (
                      <Chip label={`${housing.facility.chairs} Chairs`} size="small" />
                    )}
                  </Stack>
                </>
              )}
            </Stack>
          </Box>
        </Paper>
      </div>

      {/* Roommates Section */}
      <div className="w-full md:w-5/12 px-4">
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: 'background.default',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <PersonIcon />
            <Typography variant="h6" component="div" fontWeight="bold">
              Your Roommates
            </Typography>
          </Box>

          {housing.residents.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                You have no roommates at this time.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {housing.residents.map((person, index) => (
                <Fragment key={person._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={person.firstName}
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                        }}
                      >
                        {person.firstName.charAt(0)}
                        {person.lastName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {person.preferredName
                            ? `${person.preferredName} (${person.firstName} ${person.lastName})`
                            : `${person.firstName} ${person.middleName || ''} ${person.lastName}`}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" component="span">
                            {person.contactInfo.cellPhone}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < housing.residents.length - 1 && (
                    <Divider component="li" sx={{ mx: 3 }} />
                  )}
                </Fragment>
              ))}
            </List>
          )}
        </Paper>
      </div>
    </div>
  );
}
