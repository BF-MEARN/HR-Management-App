import { Box, Paper } from "@mui/material"

const house = {
    address: {
        num: "{1234}",
        street: "{Street}",
        city: "{City}",
        state: "{State}",
        zip: "{ZIP}"
    },
    roommates: {
        person1: {
            first_name: 'John',
            last_name: 'Doe',
            middle_name: 'Unknown',
            phone: '(123) 456-7890'
        },
        person2: {
            first_name: 'Susan',
            last_name: 'B',
            middle_name: 'Anthony',
            preferred_name: 'Jane Doe',
            phone: '(345) 678-8646'
        }
    }
}

export default function HousingDetails () {
    return (
        <Paper>
            <Box>
                <h1>Housing Details</h1>
            </Box>
            <Box>
                <h2>Address</h2>
                <h3>{Object.values(house.address).join(' ')}</h3>
            </Box>
            <Box>
                <h2>Roommates</h2>
                {Object.values(house.roommates).map(person => (
                    <h3 key={person.phone}>
                        {'preferred_name' in person ? `${person.preferred_name}, ` : `${person.first_name} ${person.middle_name} ${person.last_name}, `}
                        {person.phone}
                    </h3>
                ))}
            </Box>
        </Paper>
    )
}