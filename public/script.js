document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to fully load before executing the script
    const busForm = document.getElementById('busForm'); // Get the bus form element by its ID
    const busList = document.getElementById('busList'); // Get the bus list element by its ID

    const fetchBuses = async () => { // Define an asynchronous function to fetch bus data
        try {
            const response = await fetch('/api/buses'); // Make a GET request to the API to fetch buses
            if (!response.ok) { // Check if the response is not OK
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error with the status code
            }
            const buses = await response.json(); // Parse the JSON response
            const busList = document.getElementById('busList'); // Get the bus list element again
            busList.innerHTML = ''; // Clear existing rows in the bus list
            buses.forEach(bus => { // Iterate over each bus in the fetched data
                const row = document.createElement('tr'); // Create a new table row element
                row.innerHTML = ` 
                    <td>${bus.busNumber}</td> 
                    <td>${bus.busRoute}</td> 
                    <td>${bus.arrivalTime}</td> 
                    <td>${bus.departureTime}</td> 
                    <td>${bus.driverPhone}</td> 
                `;
                busList.appendChild(row); // Append the new row to the bus list
            });
        } catch (error) {
            console.error('Error fetching buses:', error); // Log any errors that occur during fetching
        }
    };

    busForm.addEventListener('submit', async (event) => { // Add an event listener for form submission
        event.preventDefault(); // Prevent the default form submission behavior
        const busData = { // Create an object to hold the bus data from the form
            busNumber: document.getElementById('busNumber').value, // Get bus number value
            busRoute: document.getElementById('busRoute').value, // Get bus route value
            arrivalTime: document.getElementById('arrivalTime').value, // Get arrival time value
            departureTime: document.getElementById('departureTime').value, // Get departure time value
            driverPhone: document.getElementById('driverPhone').value, // Get driver's phone number value
        };
        try {
            const response = await fetch('/api/buses', { // Make a POST request to add a new bus
                method: 'POST', // Set the request method to POST
                headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
                body: JSON.stringify(busData), // Convert the bus data object to a JSON string
            });
            if (!response.ok) { // Check if the response is not OK
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error with the status code
            }
            busForm.reset(); // Reset the form fields after successful submission
            fetchBuses(); // Fetch the updated list of buses
        } catch (error) {
            console.error('Error adding bus:', error); // Log any errors that occur during adding
        }
    });

    fetchBuses(); // Call the fetchBuses function to load the initial bus data
});
