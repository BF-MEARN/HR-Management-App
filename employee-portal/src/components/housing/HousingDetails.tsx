import { Box, Paper } from '@mui/material';

import { Employee, HousingState } from '../../store/slices/housingSlice';

export default function HousingDetails({ housing }: { housing: HousingState }) {
  return (
    <Paper>
      <Box>
        <h1>Housing Details</h1>
      </Box>
      <Box>
        <h2>Address</h2>
        <h3>{Object.values(housing.address).join(' ')}</h3>
      </Box>
      <Box>
        <h2>Roommates</h2>
        {Object.values(housing.residents).map((person: unknown) => {
          const employee = person as Employee;
          return (
            <h3 key={employee._id}>
              {'preferredName' in employee
                ? `${employee.preferredName}, `
                : `${employee.firstName} ${employee.middleName || ''} ${employee.lastName}, `}
              ({employee.contactInfo.cellPhone})
            </h3>
          );
        })}
      </Box>
    </Paper>
  );
}
