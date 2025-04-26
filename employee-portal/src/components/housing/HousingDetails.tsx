import { Fragment } from 'react/jsx-runtime';

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

import { HousingState } from '../../store/slices/housingSlice';

export default function HousingDetails({ housing }: { housing: HousingState }) {
  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6" component="div">
                Address
              </Typography>
            </Box>
            {Object.entries(housing.address).map(([k, v]) => (
              <Typography variant="body1" key={k}>
                {v}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 8 }}>
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6" component="div">
                Roommates
              </Typography>
            </Box>
            <List>
              {Object.values(housing.residents).map((person) => (
                <Fragment key={person._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={person.firstName} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        'preferredName' in person
                          ? `${person.preferredName}, `
                          : `${person.firstName} ${person.middleName || ''} ${person.lastName}`
                      }
                      secondary={person.contactInfo.cellPhone}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
