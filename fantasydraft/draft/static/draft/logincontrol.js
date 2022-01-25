const { useState, useEffect } = React;

function LoginForm(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        let csrftoken = getCookie('csrftoken')
        console.error(csrftoken)
        let userData = {username: username, password: password}
        fetch('/login', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'Application/JSON',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('success:', data)
            // as long as data['ok'] is not a false value then we're good to go.  Use !== because I'm pretty sure null is false-y
            if (data['ok'] !== false) {
                props.onLogin(username)
            } else {
                props.onError(data['error'])
                console.log(data['error'])
            }
        })
        .catch(error => {console.log('fail:', error)})
    }

    const handleChange = (e) => {
        e.preventDefault()
        e.target.type === 'password' ? setPassword(e.target.value) : setUsername(e.target.value);
    }

    return(
    <form onSubmit={handleSubmit}>
        <div className='d-flex justify-content-end mb-2'>
            <button onClick={props.onDismiss} className='btn-close btn-close' aria-label="Close"></button>
        </div>
        <legend>Log in to FantasyDraft!</legend>
        <div className='mb-2'>
        <label htmlFor='logName' className='form-label'>Username</label>
        <input type='text' name='username' id='logName' className='form-control' value={username} onChange={handleChange} required></input>
        </div>
        <div className='mb-2'>
        <label htmlFor='logPass' className='form-label'>Password</label>
        <input type='password' name='password' id='logPass' className='form-control' value={password} onChange={handleChange} required></input>
        </div>
        <div className='d-grid gap-2 mb-2'>
        <button type='submit' className='btn btn-success'>Login</button>
        </div>
    </form>
    )
}

function RegisterForm(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [email, setEmail] = useState('')

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.name === 'username') {
            setUsername(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        } else if (e.target.name === 'confirm') {
            setConfirm(e.target.value)
        } else {
            setEmail(e.target.value)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== confirm) {
            props.onError('Password and Password confirmation do not match!')
        }
        let csrftoken = getCookie('csrftoken')
        let userData = {username: username, password: password, confirm:confirm, email: email}
        fetch('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'Application/JSON'    
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('success:', data)
            if (data['ok'] !== false) {
                props.onRegister(username)
            } else {
                props.onError(data['error'])
                console.log(data['error'])
            }
        })
        .catch(error => {console.log('fail:', error)})
        return false
    }


    return(
        <form onSubmit={handleSubmit}>
            <div className='d-flex justify-content-end'>
            <button onClick={props.onDismiss} className='btn-close btn-close' aria-label="Close"></button>
            </div>
            <legend>Register for FantasyDraft!</legend>
            <div className='mb-2'>
            <label htmlFor='registerName' className='form-label'>Username</label>
            <input type='text' name='username' className='form-control' id='registerName' onChange={handleChange} required></input>
            </div>
            <div className='mb-2'>
            <label htmlFor='registerEmail' className='form-label'>Email Address</label>
            <input type='email' name='email' className='form-control' id='registerEmail' onChange={handleChange} required></input>
            </div>
            <div className='mb-2'>
            <label htmlFor='registerPass' className='form-label'>Password</label>
            <input type='password' name='password' className='form-control' id='registerPass' onChange={handleChange} required></input>
            </div>
            <div className='mb-2'>
            <label htmlFor='registerConfirm' className='form-label'>Confirm Password</label>
            <input type='password' name='confirm' className='form-control' id='registerConfirm' onChange={handleChange} required></input>
            </div>
            <div className='d-grid gap-2 mb-2'>
            <button type='submit' className='btn btn-success'>Register</button>
            </div>
        </form>
    )
}

// Defunct for now. see comment blob in login controller
// function LoggedIn(props) {
//     const greetings = ['Hey there', 'Hi', 'Welcome', 'Greetings', 'Sup']
//     const greet = greetings[Math.floor(Math.random()*greetings.length)]

//     return(
//         <div className='row'>
//             <div className='col ms-2 text-center'>
//                 <p className='text-white'>{greet}, {props.username}</p>
//             </div>
//             <div className='col d-flex justify-content-end me-2'>
//                 <a href='\logout'><button className='btn btn-success'>logout</button></a>
//             </div>
//         </div>
//     )
// }

function RegisterButton(props) {
    return(
        <button onClick={props.onClick} className='btn btn-success'>Register</button>
    )
}

function LoginButton(props) {
    return(
        <button onClick={props.onClick} className='btn btn-success'>Login</button>
    )
}


function LoginController(props) {
    // const [loggedIn, setLoggedIn] = useState(false)
    const [loginActive, setLoginActive] = useState(false)
    const [registerActive, setRegisterActive] = useState(false)

    function toggleLoginStatus() {
        loginActive ? setLoginActive(false) : setLoginActive(true)
    }

    function toggleRegister() {
        registerActive ? setRegisterActive(false) : setRegisterActive(true)
    }

    //Originally this was in the nav-bar, but it was difficult to make these forms look good on smaller screens.  So saving this 
    //in comments for now, in case I want to use the pattern again.  
    
    // //Not much of a toggle, but for the time being we're going to refresh the app on logout, so we really only need
    // //to change logged in one way. 
    // function toggleLoggedIn() {
    //     setLoggedIn(true)
    // }

    
    // useEffect(() => {
    //     if (props.username !== "") {
    //         toggleLoggedIn()
    //     }
    // }, [])

    // if (loggedIn) {
    //     return(
    //         <LoggedIn
    //         username={props.username} />
    //     )
    // } 
    
    if (loginActive) {
        return(
            <div className='row'>
                    <LoginForm
                    onLogin={props.onRegister}
                    onError={props.onError} 
                    onDismiss={toggleLoginStatus}/>
            </div>
        )
    }
    
    if (registerActive) {
        return(
            <div className='row'>
                    <RegisterForm
                    onRegister={props.onRegister}
                    onError={props.onError}
                    onDismiss={toggleRegister} />
            </div>
        )
    } 
    return(
        <div className='row'>
            <div className='col'>
                <h6 className='display-6'>New User?</h6>
                <RegisterButton
                onClick={toggleRegister} />
            </div>
            <div className='col'>
                <h6 className='display-6'>Back Again?</h6>
                <LoginButton 
                onClick={toggleLoginStatus}/>
            </div>
        </div>
    )
}