'use strict';
const { useState, useEffect } = React;

//Draft board is going to be the general information box.  On entry, players will see a default that shows the draft order and as the draft progresses, the
//draft board home screen will track the most recent round of picks.  Possibly with some sort of table showing best available players or something in that vein.
//The draft board will also have different views based on context.  Selected players will bring up their name, pertinent stats and a draft button. 
//Selected teams will show their roster so far.  Both views will have a back button to restore the base draft board.
function DraftBoard(props) {
    if (props.currentPick >= ROUNDS * props.teams.length) {
        //Draft over, display teams.
        let teamSummaries = []
        for (let i = 0; i < props.teams.length; i++) {
            let manager = props.managers[i]
            let picks = props.history.filter(pick => pick.team === props.teams[i])
            let roster = []
            for (let j = 0; j < picks.length; j++) {
                roster.push(picks[j].player)
            }
            teamSummaries.push(<TeamSummary name={props.teams[i]} manager={manager} roster={roster} currentPick={props.currentPick} max={ROUNDS*props.teams.length}/>)
        }
        return teamSummaries
    } else {
        let drafting = props.history[props.currentPick] 
        if (props.focus === 'player') {
            return <PBio fields={props.playerFocus.fields} 
                pk={props.playerFocus.pk} 
                selectPlayer={props.selectPlayer} 
                drafting={drafting.team} 
                teamControl={props.teamControl} 
                shiftFocus={props.shiftFocus}/>
        }
        if (props.focus === 'team') {
            let picks = props.history.filter(pick => pick.team === props.teamFocus)
            let roster = []
            let manager = ''
            props.teams.map((value, index) => {
                if (value === props.teamFocus) {
                    manager = props.managers[index]
                }
            })
            for (let j = 0; j < picks.length; j++) {
                roster.push(picks[j].player)
            }
            return <TeamSummary name={props.teamFocus} manager={manager} roster={roster} shiftFocus={props.shiftFocus} currentPick={props.currentPick} max={ROUNDS*props.teams.length}/>
        }
        
        return <DraftSummary history={props.history} currentPick={props.currentPick} teams={props.teams} shiftFocus={props.shiftFocus}/>
        
    }
}

//Draft summary is an overview of the draft.
function DraftSummary(props) {
    //Make it navigable.
    const [page, setPage] = useState(0)
    const [summary, setSummary] = useState([])

    //For spacing, we're going with 10 table heights for all draft board views, so we'll display labels, 8 picks, then navigation for Draft Summary
    const pageLength = 8
    const pageMax = Math.floor((ROUNDS*props.teams.length-1)/pageLength)

    //Set page on load
    useEffect(()=>{setPage(Math.floor(props.currentPick/pageLength))}, [])

    //Change summary on page change
    useEffect(()=>{
        let end = page*pageLength+8 >= ROUNDS*props.teams.length ? ROUNDS*props.teams.length : page*pageLength+8
        setSummary(props.history.slice(page*pageLength, end))
    }, [page])

    const navigate = (e) => {
        e.preventDefault()
        e.target.id === 'previous' ? setPage(page-1) : setPage(page+1) 
    }

    const teamFocus = (e) => {
        e.preventDefault()
        props.shiftFocus({'context': 'team', 'team': e.currentTarget.attributes.team.value})
    }

    return(
            <table className='table table-responsive table-sm text-center'>
                <thead>
                <tr>
                    <th>Team</th><th>Pick</th><th>Selection</th>
                </tr>
                </thead>
                <tbody>
                    {summary.map((row) =>
                        //TODO: Styling for active pick
                        <tr key={'draft_row' + row.round + 'p' + row.pick}>
                            <td><div className='d-grid gap-2 text-nowrap overflow-hidden'>
                                <button className='btn btn-outline-success btn-sm' team={row.team} onClick={teamFocus}>{row.team}</button>
                            </div></td>
                            <td>{row.round}-{row.pick}</td>
                            <td>{row.player === 'tbd' ? 'tbd' : row.player.fields.name}</td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td className='col-5'>
                        <div className='d-grid gap-2'>
                        {page === 0 ?
                        <button className='btn btn-warning btn-sm' id='previous' onClick={navigate} disabled>Previous</button> :
                        <button className='btn btn-warning btn-sm' id='previous' onClick={navigate}>Previous</button>}
                        </div>
                        </td>
                        <td className='col-2'>
                        <div className='text-center'>
                        {page + 1} of {pageMax + 1}
                        </div>
                        </td>
                        <td className='col-5'>
                        <div className='d-grid gap-2'>
                        {page === pageMax ?
                        <button id='next' className='btn btn-warning btn-sm' onClick={navigate} disabled>Next</button> :
                        <button className='btn btn-warning btn-sm' id='next' onClick={navigate}>Next</button>}
                        </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
    )
}

function PBio(props) {
    
    const resetFocus = (e) => {
        e.preventDefault()
        props.shiftFocus({'context': 'summary'})
    }

    const handleSelection = (e) => {
        e.preventDefault()
        props.selectPlayer(e.target.id)
    }

    const QB = [
        'passing_yards_YDS',
        'interceptions_INT',
        'passing_touchdowns_TDS',
        'fantasy_points_FP',
        'fantasy_VBD_VBD'
    ]
    const RB = [
        'rushing_yards_YDS',
        'rushing_yards_per_attempt_YPA',
        'rushing_touchdowns_TDS',
        'fantasy_points_FP',
        'fantasy_VBD_VBD'
    ]
    const WR = [
        'receptions_REC',
        'receiving_yards_YDS',
        'receiving_touchdowns_TDS',
        'fantasy_points_FP',
        'fantasy_VBD_VBD'
    ]

    let url = 'https://www.pro-football-reference.com/players/' + props.fields.name_code_FB[0] + '/' + props.fields.name_code_FB + '.htm'
    let statList = []
    Object.keys(props.fields).map((statName, index) => {
        switch (props.fields.position_POS) {
            case 'QB':
                if (QB.includes(statName)) {
                    statList.push(index)
                }
                break
            case 'RB':
                if (RB.includes(statName)) {
                    statList.push(index)
                }
                break
            default:
                if (WR.includes(statName)) {
                    statList.push(index)
                }
                break
        }
    })
    

    return(
        <div>
            <table className='table table-responsive table-sm'>
                <thead>
                    <tr>
                        <td colSpan='4'>
                            <div className='d-grid gap-2'>
                                <button onClick={resetFocus} className='btn btn-danger btn-sm'>Draft Summary</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th colSpan='2'>{props.fields.name}</th>
                        <th>Age</th>
                        <th>Team</th>
                        
                    </tr>
                    <tr>
                        <td colSpan='2'>{props.fields.position_POS}</td>
                        <td>{props.fields.age}</td>
                        <td>{props.fields.team}</td>
                    </tr>
                </thead>
                {/* There's likely a better way to pull labels, but we're just going use the index to grab the db name, split
                it by the separators and then pop the final item for the shorthand name */}
                <tbody className='text-center'> {Object.values(props.fields).map((stat, index) => statList.includes(index) ?
                        <tr key={index + stat}>
                            <th>{treatModelName(Object.keys(props.fields)[index].split('_'))}</th><td>{stat}</td><td colSpan='2'></td>
                        </tr>
                        :''
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='4'><a href={url}>See their whole career at Pro-Football-Reference.com</a></td>
                    </tr>
                    <tr>
                        <td colSpan='4'>
                        <div className='d-grid gap-2'>
                        {props.teamControl === props.drafting ? 
                        <button className='btn btn-success btn-sm' id={props.pk} onClick={handleSelection}>Draft</button> : 
                        <button className='btn btn-light btn-sm' id={props.pk} onClick={handleSelection} disabled>Draft</button>}
                        </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}


//Team Summary is a view that shows a teams selected players, as well as point totals for each position.
function TeamSummary(props) {
    const resetFocus = (e) => {
        e.preventDefault()
        props.shiftFocus({'context': 'summary'})
    }

    let qbs = []
    let rbs = []
    let wrs = []
    let tes = []
    
    let qbPoints = 0
    let rbPoints = 0
    let wrPoints = 0
    let tePoints = 0
    
    for (let i = 0; i < props.roster.length; i++) {
        if (props.roster[i] !== 'tbd') {
            switch (props.roster[i].fields.position_POS) {
                case 'QB': 
                    qbs.push(props.roster[i])
                    qbPoints += props.roster[i].fields.fantasy_points_FP
                    break
                case 'RB': 
                    rbs.push(props.roster[i])
                    rbPoints += props.roster[i].fields.fantasy_points_FP
                    break
                case 'WR': 
                    wrs.push(props.roster[i])
                    wrPoints += props.roster[i].fields.fantasy_points_FP
                    break
                case 'TE': 
                    tes.push(props.roster[i])
                    tePoints += props.roster[i].fields.fantasy_points_FP
                    break
            }
        }
    }
    
    // let max = Math.max(qbs.length, rbs.length, wrs.length, tes.length)

        return(
            <table className='table table-responsive table-sm text-center'>
                <thead>
                {props.currentPick < props.max ?
                <tr><td colSpan='5'><div className='d-grid gap-2'>
                    <button onClick={resetFocus} className='btn btn-danger btn-sm'>Draft Summary</button>
                </div></td></tr>
                : ''
                }
                <tr><th colSpan='5'>{props.name}</th></tr>
                <tr><td colSpan='5'>Manager: {props.manager}</td></tr>
                <tr>
                    <td></td><th>QB</th><th>RB</th><th>WR</th><th>TE</th>
                </tr>
                </thead>
                <tbody>
                {/* For spacing, we'll list the first 5 players taken at each position.  is sufficient for show, though future iterations
                we'll need a more robust solution */}
                {[...Array(5)].map((x,i) => 
                    <tr key={'roster_row' + (i + 1).toString()}>
                        <th>{i + 1}:</th>
                        <td key={'QB' + (i + 1).toString()}>{i < qbs.length ? qbs[i].fields.name : ''}</td>
                        <td key={'RB' + (i + 1).toString()}>{i < rbs.length ? rbs[i].fields.name : ''}</td>
                        <td key={'WR' + (i + 1).toString()}>{i < wrs.length ? wrs[i].fields.name : ''}</td>
                        <td key={'TE' + (i + 1).toString()}>{i < tes.length ? tes[i].fields.name : ''}</td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td><td>QB Pts: {qbPoints}</td><td> RB pts: {rbPoints}</td><td> WR pts: {wrPoints}</td><td>TE Points: {tePoints}</td>
                    </tr>
                </tfoot>
            </table>
        )
}


//While I went another way on player display, but saving for now.
// function ReferenceEmbed(props) {    
//     function getUrl() {
//         // example = <script src="https://widgets.sports-reference.com/wg.fcgi?css=1&site=pfr&url=%2Fplayers%2FH%2FHenrDe00.htm&div=div_rushing_and_receiving"></script>
//         let baseUrl = "https://widgets.sports-reference.com/wg.fcgi?css=1&site=pfr&url=%2Fplayers%2F"
//         //So how do we automate this.  In general, we need to get the name of the player and the first letter of their namecode.
//         let letterIndex = props.name_code.split('')[0]
//         //Combine this together to get the players page, then use position to decide the appropriate div to embed.
//         baseUrl = baseUrl + letterIndex + "%2F" + props.name_code + ".htm&div="
//         //Kinda WR, TE could probably be folded as a default, but you never know when you want to change this sort of thing.
//         switch (props.position) {
//             case 'QB': baseUrl = baseUrl + "div_passing"; break;
//             case 'RB': baseUrl = baseUrl + "div_rushing_and_receiving"; break;
//             case 'WR': baseUrl = baseUrl + 'div_receiving_and_rushing'; break;
//             case 'TE': baseUrl = baseUrl + 'div_receiving_and_rushing'; break;
//             default: baseUrl = baseUrl + 'div_receiving_and_rushing'; break;
//         }
//         return baseUrl
//     }
//     return <div></div>
// }
