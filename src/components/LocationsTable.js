import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { 
    field: 'name', 
    headerName: "Name", 
    width: 200, 
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 300,
  },
  {
    field: 'latitude',
    headerName: 'Latitude',
    width: 200,
  },
  {
    field: 'longitude',
    headerName: 'Longitude',
    width: 200,
  },
  {
    field: 'wind',
    headerName: 'Wind Probability',
    width: 200,
  },
  {
    field: 'when',
    headerName: 'When To Go',
    width: 200,
  },
];

const LocationsTable = () => {

  const [locations, setLocations] = useState([]);

  const getLocations = async () => {
    const locations = await fetch("https://606eaced0c054f001765756e.mockapi.io/spot");
    const result = await locations.json();
    setLocations(result);
  }

  let rows = [];
  locations.map(loc => rows.push(
     {
      id: loc.id, 
      name: loc.name, 
      country: loc.country, 
      latitude: loc.lat, 
      longitude: loc.long, 
      wind: loc.probability, 
      when: loc.month,
      code: loc.id,
    }
  ));

  useEffect(() => {
    getLocations();
  }, []);

  return (
    <>
    <div id="table">
      <DataGrid rows={rows} columns={columns.map((column) => ({
        ...column,
        disableClickEventBubbling: true,
      }))} 
      pageSize={5} rowsPerPageOptions={[5, 10, 25, 50, 100]}/>
    </div>
    </>
  );
}
 
export default LocationsTable;