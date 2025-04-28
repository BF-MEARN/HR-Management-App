import { useEffect, useState } from 'react';

import { Assignment as AssignmentIcon, Home as HomeIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

import HousingDetails from '../components/housing/HousingDetails';
import ExistingFacilityReport from '../components/housing/reports/ExistingFacilityReport';
import FacilityReportForm from '../components/housing/reports/FacilityReportForm';
import { useAppDispatch, useAppSelector } from '../store';
import { getAllMyReports } from '../store/slices/facilityReportSlice';
import { getHousing } from '../store/slices/housingSlice';
import { api } from '../utils/utils';

// Custom styled components using the theme
const StyledTabs = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}) => {
  const theme = useTheme();

  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant="fullWidth"
      sx={{
        mb: 3,
        '& .MuiTabs-indicator': {
          backgroundColor: theme.palette.primary.main,
          height: 3,
        },
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Tab icon={<HomeIcon />} iconPosition="start" label="Housing Details" />
      <Tab icon={<AssignmentIcon />} iconPosition="start" label="Facility Reports" />
    </Tabs>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="h5"
    component="h2"
    sx={{
      mb: 3,
      fontWeight: 600,
      position: 'relative',
      display: 'inline-block',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '50%',
        height: '3px',
        background: (theme) => theme.palette.primary.main,
        bottom: -5,
        left: 0,
      },
    }}
  >
    {children}
  </Typography>
);

// Improved Housing Page component
export default function HousingPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const housingSelect = useAppSelector((state) => state.housing);
  const facilityReportsSelect = useAppSelector((state) => state.facilityReports);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    async function fetching() {
      const resHouse = await api('/employee/housing/getHouse');
      if (resHouse.ok) {
        const { house } = await resHouse.json();
        delete house.__v;
        delete house.createdAt;
        delete house.updatedAt;
        dispatch(getHousing(house));

        const resFacilityReports = await api(
          `/employee/facilityReport/house/${house._id.toString()}`
        );
        if (resFacilityReports.ok) {
          const facilityReports = await resFacilityReports.json();
          dispatch(getAllMyReports(facilityReports));
        }
      }
    }
    fetching();
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <div className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
          Housing
        </Typography>
        <Divider />
      </div>
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, pt: 3 }}>
            <StyledTabs value={activeTab} onChange={handleTabChange} />
          </Box>

          <Box sx={{ px: 3, pb: 3 }}>
            {activeTab === 0 && (
              <Box>
                <SectionHeading>Your Housing Details</SectionHeading>
                <HousingDetails housing={housingSelect} />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <SectionHeading>Submit a New Report</SectionHeading>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    background: alpha(theme.palette.primary.light, 0.02),
                  }}
                >
                  <FacilityReportForm houseId={housingSelect._id} />
                </Paper>

                <SectionHeading>Your Reports</SectionHeading>
                <Stack spacing={3}>
                  {facilityReportsSelect.length === 0 ? (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mt: 2, fontStyle: 'italic' }}
                    >
                      You have not submitted any reports yet.
                    </Typography>
                  ) : (
                    facilityReportsSelect.map((report) => (
                      <Box
                        key={report._id}
                        sx={{
                          '& .MuiCard-root': {
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: theme.shadows[3],
                            },
                          },
                        }}
                      >
                        <ExistingFacilityReport report={report} />
                      </Box>
                    ))
                  )}
                </Stack>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
