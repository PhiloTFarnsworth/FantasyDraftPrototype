'use strict';
const { useState, useEffect } = React;

function FastDraftInitiator(props) {
    const [open, setOpen] = useState(false)
    const [teams, setTeams] = useState(1)
    const [teamName, setTeamName] = useState('')
    const [leagueName, setLeagueName] = useState('')
    const [draftPosition, setDraftPosition] = useState(1)
    const [initialized, setInitialized] = useState(false)
    const [rejoin, setRejoin] = useState(false)
    const [draftProps, setDraftProps] = useState({})

    function toggleOpen(e) {
        e.preventDefault()
        open ? setOpen(false) : setOpen(true)
    }

    function handleTeams(e) {
        e.preventDefault()
        setTeams(e.target.value)
        if (draftPosition > e.target.value) {
            setDraftPosition(e.target.value)
        }
    }

    function handleDraftPosition(e) {
        e.preventDefault()
        setDraftPosition(e.target.value)
    }

    function handleTeamName(e) {
        e.preventDefault()
        setTeamName(e.target.value)
    }

    function handleLeagueName(e) {
        e.preventDefault()
        setLeagueName(e.target.value)
    }

    function startDraft(e) {
        e.preventDefault()
        let csrftoken = getCookie('csrftoken')
        fetch('/initializeDraft', {
            method: 'POST',
            body: JSON.stringify({teams: teams, position: draftPosition, name: teamName, league: leagueName}),
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'Application/JSON'
            }
        })
        .then(response => response.json())
        //data will carry our league's ID and the list of teams in order of their first round draft position.
        .then(data => {
            setDraftProps(data)
            setInitialized(true)
        })
        .catch(error => console.log('fail:', error))
    }

    function rejoinDraft(league_id, team_id) {
        // need to get team and league id
        let csrftoken = getCookie('csrftoken')
        fetch('rejoin_draft', {
            method: 'POST',
            body: JSON.stringify({'league_id': league_id, 'team_id': team_id}),
            headers: {'X-CSRFToken': csrftoken, 'Content-Type': 'Application/JSON'}
        })
        .then(response => response.json())
        .then(data => {
            setDraftProps(data)
            setRejoin(true)
        })
        .catch(error => console.log('fail:', error))
    }

    if (rejoin) {
        return <Draft leagueID={draftProps.leagueID} 
            teams={draftProps.teams} 
            commissioner={draftProps.commissioner} 
            teamControl={draftProps.teamControl} 
            managers={draftProps.managers} 
            user={props.user} 
            history={JSON.parse(draftProps.history)}
            onError={props.onError} 
            locked={draftProps.locked}
            onSuccess={props.onSuccess}/>
    }

    //A player that initializes a draft is considered the commissioner and can chose when to start a draft.
    if (initialized) {
        return <Draft leagueID={draftProps.leagueID} 
            teams={draftProps.teams} 
            commissioner={draftProps.commissioner} 
            teamControl={draftProps.commissioner} 
            managers={draftProps.managers} 
            user={props.user} 
            history={[]}
            onError={props.onError}
            onSuccess={props.onSuccess}/>
    }

    if (!open) {
        return(
            <div className='container'>
            <div className='row'>
                <div className='col text-center'>
                    <h1 className='display-4'>Create a new draft!</h1>
                    <button className='btn btn-success' onClick={toggleOpen}>Fast Draft</button>
                    <p>Fast Draft provides a few essential options and gets you up and drafting quickly</p>
                    <button className='btn btn-light' disabled>Custom Draft</button>
                    <p>Custom Draft provides a large range of options to tailor your league's draft to your exacting tastes (Not Available)</p>
                    <button className='btn btn-light' disabled>Public Draft</button>
                    <p>Join other players from around the world in our public run leagues (Not Available)</p>
                </div>
                <DraftDirectory user={props.user} rejoin={rejoinDraft}/>
            </div>
            </div>
        )
    } else {
        //Real range madness.  Sliders are not ideal but I enjoy moving them side to side
        return(
            <div className='container'>
            <div className='row'>
                <div className='col text-center m-5 p-3 bg-light'>
                    <div className='d-flex justify-content-end'>
                        <button className='btn-close btn-close' onClick={toggleOpen}></button>
                    </div>
                    <h1 className='display-3'>Fast Draft</h1>
                    <form onSubmit={startDraft}>
                        <div className='row mx-2'>
                        <input className='form-range' onChange={handleTeams} type='range' min='1' max='14' value={teams}></input>
                        <p>Teams: </p><h3>{teams > 0 ? teams : 'Random'}</h3>
                        <input className='form-range' onChange={handleDraftPosition} type='range' min='1' max={teams} value={draftPosition}></input>
                        <p>Draft Position: </p><h3>{draftPosition > 0 ? draftPosition : 'Random'}</h3>
                        </div>
                        <div className='row d-grid gap-2 mb-2'>
                            <div className='col-auto'>
                                <input type='text' className='form-control' onChange={handleTeamName} placeholder='Name Your Team!' required></input>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' onChange={handleLeagueName} placeholder='Name Your League!'></input>
                            </div>
                        </div>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success' type='submit'> Start Draft! </button>
                        </div>
                    </form>
                </div>
                {/* <DraftDirectory user={props.user} rejoin={rejoinDraft} /> */}
            </div>
            </div>
        )
    }
}

function Welcome(props) {
    if (props.user === '') {
        return <p className='text-white text-center mt-3'>Welcome Guest!</p>
    }
    return <p className='text-white text-center mt-3'>Welcome {props.user}!</p>
}

function MainHeader(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
            <div className='container-fluid text-center'>
            <div className='col'>
            <Welcome user={props.user}/>
            </div>
            <div className='col-6'>
                <a className='navbar-brand' href=''>
                    Fantasy Draft
                </a>
            </div>
            <div className='col'>
                {props.user === '' ? '' : <a href='\logout'><button className='btn btn-warning'>logout</button></a>}
            </div>
            </div>
        </nav>                
    )
}

//LandingView will be the patter for an unregistered/not-logged-in user, so we're looking at some sort of statement on why to register, with a register box
//across from the statement.   
function LandingView(props) {
    return(
        <div className='row'>
            <div className='col'>
                <h4 className='display-4'>FantasyDraft</h4>
                <p>
                    FantasyDraft is a mock up of a fantasy football draft app, which allows users to start a draft and share a link with other users to initiate a draft.  Users can then choose from players from NFL teams to build a roster to (eventually...) compete weekly against other users in their league.  Please register and start a draft today!
                </p>
            </div>
            <div className='col text-center'>
                <LoginController 
                    username={props.user}
                    onRegister={props.handleUserChange}
                    onError={props.onError}/>
            </div>
        </div>
    )
}

//draft directory will return completed and active drafts for a user, allowing them to rejoin a draft in the event they reload the client, or
// to view completed drafts.
function DraftDirectory(props) {
    const [completedDrafts, setCompletedDrafts] = useState([])
    const [activeDrafts, setActiveDrafts] = useState([])
    const [activeView, setActiveView] = useState(true)
    const [drafts, setDrafts] = useState([])

    useEffect(()=> {
        fetch('get_drafts', {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            setCompletedDrafts(data.completedDrafts)
            setActiveDrafts(data.activeDrafts)
            setDrafts(data.activeDrafts)
        })  
    }, [])

    //Sometimes you just have to toggle a toggle
    function activeToggle() {
        if (activeView) {
            setActiveView(false)
            setDrafts(completedDrafts)
        } else {
            setActiveView(true)
            setDrafts(activeDrafts)
        }
    }

    const draftJoin = (e) => {
        e.preventDefault()
        let properties = e.target.id.split('-')
        props.rejoin(properties[0], properties[1])
    }

    if (props.user === '') {
        return null
    }

    return(
        <div className='col border-start border-success'>
            <div className='text-center'><h1 className='display-4'>{activeView?'Rejoin a Draft!':'Review a Draft!'}</h1></div>
            <table className='table table-responsive overflow-auto'>
                <thead>
                <tr>
                    <td colSpan='4'><div className='d-grid gap-2'>
                    {activeView ? 
                        <div className='btn-group' role='group' aria-label='Active/Completed draft toggle'>         
                            <button className='btn btn-dark btn-sm' disabled>Active Drafts</button>
                            <button className='btn btn-warning btn-sm' onClick={activeToggle}>Completed Drafts</button>
                        </div> :
                        <div className='btn-group' role='group'>
                            <button className='btn btn-warning btn-sm' onClick={activeToggle}>Active Drafts</button>
                            <button className='btn btn-dark btn-sm' disabled>Completed Drafts</button>
                        </div>
                    }
                    </div></td>
                </tr></thead>
                <tbody>
                    <tr><th colSpan='2'>League</th><th>Team</th><th></th></tr>
                    {drafts.map((draft) => 
                    <tr key={draft.league + draft.teamName + draft.team}>
                        <td>{draft.leagueName}</td>
                        <td>#{draft.league}</td>
                        <td>{draft.teamName}</td>
                        <td><div className='d-grid gap-2'>
                            <button className='btn btn-success btn-sm' id={draft.league + '-' + draft.team} onClick={draftJoin}>Rejoin Draft!</button>
                        </div></td></tr> 
                    )}
                </tbody>
            </table>
        </div>
    )
}

// Future iterations will likely spin off the base part of the app into a 'lobby'.
function App() {
    const [user, setUser] = useState('')
    const [error, setError] = useState('')
    const [render, setRender] = useState(false)
    const [success, setSuccess] = useState('')


    function handleUserChange(username) {
        setUser(username)
    }

    function addError(message) {
        setError(message)
    }

    function clearError() {
        setError('')
    }
    
    function addSuccess(message) {
        setSuccess(message)
    }

    function clearSuccess() {
        setSuccess('')
    }

    useEffect(() => {
        const username = JSON.parse(document.getElementById('username-data').textContent)
        if (document.getElementById('error')) {
            const pageError = JSON.parse(document.getElementById('error').textContent)
            setError(pageError)
        }
        if (username !== '') { 
            setUser(username)
        }
        setRender(true)
    }, [])

    //For people who come to the site without any context, we want to offer the draft initiator.  But if you are directed by a special link, then we want to load you right 
    //into a draft.  So how do.  I think we use the window.location and find out whether they are using a path that
    //has been provided for a draft.  Another huge refactor candidate, but I think for the time being, we just disqualify queries on our base location, and assume that any
    //path they use besides '/' is a draft join.
    let path = window.location.pathname.toString()
    let splitPath = path.split('/')
    //If we split on '/', we should return an empty string representing the host directory, a string named 'draft', a string with a number representing leagueID
    //and string with the team name.  For the time being, we'll simply check if it's a long enough path that begins with \draft\.
    if (render) {
        if (splitPath.length === 4) {
            if (splitPath[1] == 'draft') {
                let leagueID = splitPath[2]
                let teamName = splitPath[3].split('_').join(' ')
                //To load a draft, we also need a list of team names in the order of the picks.
                const teams = JSON.parse(document.getElementById('teams').textContent)
                const managers = JSON.parse(document.getElementById('teams').textContent)
                return( 
                    <div className='container' id='mainWindow'>
                        <MainHeader user={user} />
                        <MyError error={error} onClick={clearError}/>
                        <MySuccess success={success} onClick={clearSuccess}/>
                        <Draft leagueID={leagueID} 
                            teams={teams} 
                            commissioner={''} 
                            teamControl={teamName} 
                            managers={managers} 
                            history={[]} 
                            onError={addError} 
                            onSuccess={addSuccess}/>
                    </div>
                    )
            } else {
                path = '/'
            }
        } else {
            path = '/'
        }
        if (path === '/') {
            return(
                <div className='container' id='mainWindow'>
                    <MainHeader user={user}  />
                    <MyError error={error} onClick={clearError}/>
                    <MySuccess success={success} onClick={clearSuccess}/>
                    {user !== '' ? 
                        <FastDraftInitiator user={user} onError={addError} onSuccess={addSuccess}/> : 
                        <LandingView handleUserChange={handleUserChange} user={user} onError={addError}/>}
                </div>
            )
        }
    }
    return null
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);