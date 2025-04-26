import { useEffect } from 'react';

import { Box, Divider, Paper, Stack, Typography } from '@mui/material';

import HousingDetails from '../components/housing/HousingDetails';
import ExistingFacilityReport from '../components/housing/reports/ExistingFacilityReport';
import FacilityReportForm from '../components/housing/reports/FacilityReportForm';
import { useAppDispatch, useAppSelector } from '../store';
import { getAllMyReports } from '../store/slices/facilityReportSlice';
import { getHousing } from '../store/slices/housingSlice';
import { api } from '../utils/utils';

export default function HousingPage() {
  const dispatch = useAppDispatch();
  const housingSelect = useAppSelector((state) => state.housing);
  const facilityReportsSelect = useAppSelector((state) => state.facilityReports);

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
    <>
      <Box p={4}>
        <HousingDetails housing={housingSelect} />
      </Box>
      <Paper variant="outlined">
        <FacilityReportForm houseId={housingSelect._id} />
        <Divider />
        <Box px={2} margin={4}>
          <Stack gap={2}>
            <Typography variant="h6" component="div">
              Existing/Past Reports
            </Typography>

            {facilityReportsSelect.map((report) => (
              <ExistingFacilityReport key={report._id} report={report} />
            ))}
          </Stack>
        </Box>
      </Paper>
    </>
  );
}
