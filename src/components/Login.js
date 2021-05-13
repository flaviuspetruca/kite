import React, {useState} from 'react';
import {useHistory} from "react-router-dom";

const Login = (handleLogin) => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [isLogged, setIsLogged] = useState(false);
    const history = useHistory();

    //styling for the inputs
    const [userInput, setUserInput] = useState({borderColor: "#ced4da"});
    const [passwordInput, setPasswordInput] = useState({borderColor: "#ced4da"});

    const sendRequest = async() => {
        const data = {username: user, password}   
        const req = await fetch("https://606eaced0c054f001765756e.mockapi.io/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if(req.status === 201){
            const resp = await req.json();
            setIsLogged(true);
            setUserInput({borderColor: "green"});
            setPasswordInput({borderColor: "green"});
            handleLogin.setUsername(resp.username);
            history.push('/');
        }
        else{
            setIsLogged('failed');
            setUserInput({borderColor: "red"});
            setPasswordInput({borderColor: "red"});
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        sendRequest();
    }

    return (
    <div className="auth-wrapper">
        <div className="auth-inner">
            <form onSubmit={handleSubmit}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={userInput} 
                        placeholder="Username" 
                        onChange={e => {
                                        setUser(e.target.value); 
                                        setUserInput({borderColor: "#ced4da"}); 
                                        setIsLogged(false);
                                        }
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        style={passwordInput} 
                        placeholder="Enter password" 
                        onChange={e => { 
                                        setPassword(e.target.value); 
                                        setPasswordInput({borderColor: "#ced4da"})
                                        setIsLogged(false);
                                        }
                        } 
                    />
                </div>

                {
                        isLogged === 'failed' ? 
                            <h5 className="text-center text-danger mx-3">Wrong username/password</h5>
                        :
                            <></>
                }

                <button type="submit" className="btn-block submit">Submit</button>
            </form> 
        </div>
    </div>
    );
}
 
export default Login;