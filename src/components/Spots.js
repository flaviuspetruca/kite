import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import LocationsTable from './LocationsTable';
import Spot from './Spot';

const Spots = (props) => {

    const user = props.props;
    const [favourite, setFavourite] = useState([]);
    const [locations, setLocations] = useState([]);
    const [country, setCountry] = useState('');
    const [probability, setProbability] = useState('');

    //countries after filter is applied
    const [filtC, setFC] = useState('');
    //probability after filter is applied
    const [filtP, setFP] = useState('');

    //get filter data on click
    const filteredData = () => {
        setFC(country);
        setFP(probability);
    }

    //Used to recenter view of map when markers are filtered
    function MyComponent(props) {
        const map = useMap();
        map.setView(props.props);
        return null;
    }
    
    const getLocations = async () => {
        const locations = await fetch("https://606eaced0c054f001765756e.mockapi.io/spot");
        const result = await locations.json();
        setLocations(result);
    }

    const getFavourite = async () => {
        const favouriteSpots = await fetch("https://606eaced0c054f001765756e.mockapi.io/favourites");
        const result = await favouriteSpots.json();
        setFavourite(result);
    }
    

    useEffect(() => {
        getLocations();
        if(user !== null){
            getFavourite();
        }
    }, []);

    return (
        <>
        <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={false}>
        <Dropdown id="filter">
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Filter
              </Dropdown.Toggle>

              <Dropdown.Menu id="drop">    
                <div className="input-group">
                    <h6 className="text-center w-100">Country</h6>
                        <select defaultValue="Choose..." className="custom-select" id="inputGroupSelect04" onChange={e => {
                            e.target.value !== "Choose..." ? setCountry(e.target.value) : setCountry('')}}>
                            <option value="Choose...">Choose...</option>
                            {
                                probability === ''?
                                locations.map((loc) => (
                                <option key={loc.id} value={loc.country}>{loc.country}</option>
                                ))
                                :
                                locations.map((loc) => {
                                if(loc.probability == probability){
                                    return <option key={loc.id} value={loc.country}>{loc.country}</option>
                                }
                                })
                            }
                        </select>
                </div>

                <div className="input-group">
                    <h6 className="text-center w-100 mt-3">Wind Probability</h6>
                        <select defaultValue="Choose..." className="custom-select" id="inputGroupSelect04" onChange={e => {
                            e.target.value !== "Choose..." ? setProbability(e.target.value) : setProbability('')}}>
                            <option value="Choose...">Choose...</option>
                            {
                                country === ''?
                                locations.map((loc) => (
                                <option key={loc.id} value={loc.probability}>{loc.probability}</option>
                                ))
                                :
                                locations.map((loc) => {
                                if(loc.country === country)
                                    return <option key={loc.id} value={loc.probability}>{loc.probability}</option>
                                })      
                            }
                        </select>
                </div>

                <button className="btn btn-light mt-3" onClick={filteredData}>Filter</button>
                
              </Dropdown.Menu>
          </Dropdown>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            filtC !== '' && filtP !==''?
                locations.map(loc => {
                    if(loc.country === filtC && loc.probability == filtP){
                        const data=[loc.lat, loc.long];
                        return (
                            <>
                            <MyComponent props={data} key={loc.id+1}/>
                            <Spot props={[loc, user, favourite]} key={loc.id}></Spot>
                            </>
                        )
                    }
                })
            :
                filtC !==''?
                    locations.map(loc =>  {
                        if(loc.country === filtC){
                            const data=[loc.lat, loc.long];
                            return (
                                <>
                                <MyComponent props={data} key={loc.id+1}/>
                                <Spot props={[loc, user, favourite]} key={loc.id}></Spot>
                                </>
                                )
                        }
                    })
            :
                filtP !=='' ?
                    locations.map(loc =>  {
                        if(loc.probability == filtP){
                            const data=[loc.lat, loc.long];
                            return (
                                <>
                                <MyComponent props={data} key={loc.id+1}/>
                                <Spot props={[loc, user, favourite]} key={loc.id}></Spot>
                                </>
                                )
                        }
                    })
            :
                locations.map(loc =>  (
                    <Spot props={[loc, user, favourite]} key={loc.id}></Spot>
                ))
        }
        
        </MapContainer>
        <LocationsTable id="locationsTabel"/>
        </>
     );
}
 
export default Spots; 
