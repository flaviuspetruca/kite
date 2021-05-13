import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
import Spinner from 'react-bootstrap/Spinner'
import iconShadow from './marker-shadow.png';
import iconUrlBlue from './marker-icon-2x-blue.png';
import iconUrlGold from './marker-icon-2x-gold.png';

const Spot = (props) => {

    //defining LeafletIcons
    var LeafletIcon = Icon.extend({
        options: {
            shadowUrl: iconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }
    });
    var BlueIcon = new LeafletIcon({iconUrl: iconUrlBlue});
    var GoldIcon = new LeafletIcon({iconUrl: iconUrlGold});

    //initialize icon to be basic
    const [markerIcon, setMarkerIcon] = useState(BlueIcon);

    const [fail, setFail] = useState(false);
    const [spin, setSpin] = useState(false);

    //location and user props
    const data = props.props;
    const id = data[0].id;
    const lat = data[0].lat;
    const long = data[0].long;
    const name = data[0].name;
    const country = data[0].country;
    const wind = data[0].probability;
    const when = data[0].month;
    const user = data[1];
    const favourite = data[2];


    const addToFavorites = async () => {
        setSpin(true);
        const body = {spot: id};
        const req = await fetch("https://606eaced0c054f001765756e.mockapi.io/favourites", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        setSpin(false);

        if(req.status === 201){
            setMarkerIcon(GoldIcon);
            setFail(false);
        }   
        else
            setFail(true);
    }

    const removeFromFavorites = async () => {
        setSpin(true);
        const favouriteSpots = await fetch("https://606eaced0c054f001765756e.mockapi.io/favourites");
        const result = await favouriteSpots.json();

        //the api sets the id differently when added to favourite so this is my way to fix it:)
        const found = result.filter( fav => {
            if(fav.spot === id){
                return fav;
            }
        })

        //checking because if too many requests are made it may not find the selected spot in the DB 
        if(found[0] !== undefined){
            const url = `https://606eaced0c054f001765756e.mockapi.io/favourites/${found[0].id}`;

            const req = await fetch(url, {
                method: 'DELETE',
            })
            setSpin(false);
            if(req.status === 200){
                setMarkerIcon(BlueIcon);
                setFail(false);
            }
            else
                setFail(true);
        }
        else
            setFail(true);
    }

    //styling for react-modal
    const customStyles = {
        content : {
            top                     : '50%',
            left                    : '50%',
            right                   : 'auto',
            bottom                  : 'auto',
            marginRight             : '-50%',
            transform               : 'translate(-50%, -50%)',
            overflow                : 'hidden',
            position                : 'absolute',
            borderRadius            : '15px',
            backgroundColor         : 'black',
            color                   : 'white',
        },
        overlay: {
            zIndex                  : 1000,
            backgroundColor         : 'rgba(255,255,255,0.4)',
        },
    };

    //functions to open/close react-modal
    const [modalIsOpen,setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }

    useEffect(() => {
    //every render marker icons are set
        if(favourite !== []){
            favourite.map(fav => {
                if(fav.spot == id){
                    setMarkerIcon(GoldIcon);
                }
            })
        }
        else
            setMarkerIcon(BlueIcon);
    }, [])

    return (
        <>
        <Modal 
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h4 className="text-center mb-3">You need to log in first!</h4>
                <div className="d-flex flex-row justify-content-center align-items-center">
                    <a href="/login" className="btn btn-primary mr-1">Log in</a>
                    <button className="btn btn-warning ml-1" onClick={closeModal}>Close</button>
                </div>
            </div>
        </Modal>

        <Marker position={[lat, long]} icon={markerIcon}>
            <Popup>
            <div className="d-flex flex-column justify-content-center align-items-center">
            <h5 className="text-center ">{name}</h5>
            <h6 className="text-center ">Country: {country}</h6>
            <h6 className="text-center ">Wind Probability: {wind}</h6>
            <h6 className="text-center ">Latitude: {lat}</h6>
            <h6 className="text-center ">Longitude: {long}</h6>
            <h6 className="text-center ">When to go: {when}</h6>
            {
                user !== null? 
                    markerIcon.options.iconUrl !== GoldIcon.options.iconUrl ?
                        fail === true ? 
                            <>
                            <h6 className="text-center text-danger">Couldn't add to favourites!</h6>
                            <h6 className="text-center text-danger">You might be making requests to fast!</h6>
                            {
                                spin === true?
                                    <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                    </Spinner>
                                :
                                    <button className="btn btn-primary" onClick={addToFavorites}>Add to favourites</button>
                            }
                            </>
                        :
                            spin === true?
                                <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                                </Spinner>
                            :
                                <button className="btn btn-primary" onClick={addToFavorites}>Add to favourites</button>
                    :
                        fail === true ? 
                            <>
                            <h6 className="text-center text-danger">Couldn't remove from favourites!</h6>
                            <h6 className="text-center text-danger">You might be making requests to fast!</h6>
                            {
                                spin === true?
                                    <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                    </Spinner>
                                :
                                    <button className="btn btn-danger" onClick={removeFromFavorites}>Remove from favourites</button>
                            }
                            </>
                            :
                                spin === true?
                                    <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                    </Spinner>
                                :
                                    <button className="btn btn-danger" onClick={removeFromFavorites}>Remove from favourites</button>
                    :
                        <button className="btn btn-primary" onClick={openModal}>Add to favourites</button>
                }
            </div>
            </Popup>
        </Marker>
        </>
     );
}
 
export default Spot; 
