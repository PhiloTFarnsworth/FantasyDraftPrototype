'use strict';
const { useState, useEffect, useRef } = React;

function DraftPool(props) {
    const passing = [
        'completions_CMP',
        'pass_attempts_ATT',
        'passing_yards_YDS',
        'interceptions_INT'
    ]
    const rushing = [
        'rush_attempts_ATT',
        'rushing_yards_YDS',
        'rushing_yards_per_attempt_YPA',
    ]
    const receiving = [
        'targets_TGT',
        'receptions_REC',
        'receiving_yards_YDS',
        'receiving_yards_per_catch_YPC',
    ]
    const miscScoring = [
        'two_point_conversion_2PC',
        'two_point_conversion_pass_2PP'
    ]
    const fantasy = [
        'fantasy_PPR_PPR',
        'fantasy_DK_DK',
        'fantasy_FD_FD',
    ]
    const general = [
        'age',
        'team',
        'games_played_G',
        'games_started_GS',
    ]
     const defaultFields = [
         'position_POS',
         'name',
         'passing_touchdowns_TDS',
         'rushing_touchdowns_TDS',
         'receiving_touchdowns_TDS',
         'fantasy_points_FP',
         'fantasy_VBD_VBD'
    ]
    const [expandables, setExpandables] = useState(defaultFields)
    const [passSpan, setPassSpan] = useState(1)
    const [rushSpan, setRushSpan] = useState(1)
    const [recSpan, setRecSpan] = useState(1)
    const [fantSpan, setFantSpan] = useState(2)
    const [generalSpan, setGeneralSpan] = useState(2)


    const HandleSort = (e) => {
        e.preventDefault()
        props.tableSort(e.currentTarget.id)
    }

    const HandleFocus = (e) => {
        e.preventDefault()
        props.shiftFocus({'context': 'player', 'player': props.players[e.target.parentElement.id]})
    }

    //list comprehensions would be nice here, but this resolves alright.
    const expandStats = (e) => {
        switch(e.target.id) { 
        case 'general_x':
            if (general.every(category => expandables.includes(category))) { 
                setExpandables([...expandables].filter((category) => !general.includes(category))) 
                setGeneralSpan(2)
            } else {
                setExpandables([...expandables].concat(general))
                setGeneralSpan(general.length + 2)
            }
            break
        case 'pass_x':
            if (passing.every(category => expandables.includes(category))) { 
                setExpandables([...expandables].filter((category) => !passing.includes(category))) 
                setPassSpan(1)
            } else {
                setExpandables([...expandables].concat(passing))
                setPassSpan(passing.length + 1)
            }
            break
        case 'rush_x':
            if (rushing.every(category => expandables.includes(category))) { 
                setExpandables([...expandables].filter((category) => !rushing.includes(category))) 
                setRushSpan(1)
            } else {
                setExpandables([...expandables].concat(rushing))
                setRushSpan(rushing.length + 1)
            }
            break
        case 'rec_x':
            if (receiving.every(category => expandables.includes(category))) {
                setExpandables([...expandables].filter((category) => !receiving.includes(category))) 
                setRecSpan(1)
            } else {
                setExpandables([...expandables].concat(receiving))
                setRecSpan(receiving.length + 1)
            }
            break
        case 'misc_x':
            miscScoring.every(category => expandables.includes(category)) ?
            setExpandables([...expandables].filter((category) => !miscScoring.includes(category))) : 
            setExpandables([...expandables].concat(miscScoring))
            break
        case 'fant_x':
            if (fantasy.every(category => expandables.includes(category))) { 
                setExpandables([...expandables].filter((category) => !fantasy.includes(category))) 
                setFantSpan(2)
            } else {
                setExpandables([...expandables].concat(fantasy))
                setFantSpan(fantasy.length + 2)
            }
            break
        }
    }

    return(
        <div className='table-responsive overflow-auto'>
        <table className='table table-bordered border-success table-hover table-sm text-center'>
            <caption>Draft Pool</caption>
            <thead>
                <tr>
                    <td colSpan={generalSpan}>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success btn-sm' onClick={expandStats} id='general_x'> General </button>
                        </div>
                    </td>
                    <td colSpan={passSpan}>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success btn-sm' onClick={expandStats} id='pass_x'> Passing </button>
                        </div>
                    </td>
                    <td colSpan={rushSpan}>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success btn-sm' onClick={expandStats} id='rush_x'> Rushing </button>
                        </div>
                    </td>
                    <td colSpan={recSpan}>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success btn-sm' onClick={expandStats} id='rec_x'> Receiving </button>
                        </div>
                    </td>
                    {/* <td><button onClick={expandStats} id='misc_x'> Misc </button></td> */}
                    <td colSpan={fantSpan}>
                        <div className='d-grid gap-2'>
                            <button className='btn btn-success btn-sm' onClick={expandStats} id='fant_x'> Fantasy </button>
                        </div>
                    </td>
                </tr>
                <tr key='headers'>
                    {props.headers.map((header) => {
                        //We need to split our headers on the underscores.  If the can be split, then the final
                        //string will be its abbreviation, while the rest of the strings are the full name.
                        if (header === 'name_code_FB') {
                            return
                        } else {
                            if (expandables.includes(header)){
                                let cured = header.split("_")
                                if (cured.length === 1) {
                                    return <th key={header} scope='col'><div className='d-grid gap-2'><button className="btn btn-warning btn-sm" id={header} onClick={HandleSort}>{header.toUpperCase()}</button></div></th>
                                } else {
                                    let verbose = ""
                                    for (let i = 0; i < cured.length - 1; i++ ) {
                                        verbose = verbose + "_" + cured[i]
                                    }
                                    return <th key={verbose.trimStart()} scope='col'><div className='d-grid gap-2'><button className="btn btn-warning btn-sm" id={header} onClick={HandleSort}>{cured[cured.length - 1]}</button></div></th>
                                }
                            }
                        }
                    })}
                </tr>
            </thead>
            <tbody>
            {props.players.map((player, draftIndex) => 
                <tr key={player.fields['name_code_FB']} onClick={HandleFocus} id={draftIndex}>
                    {Object.values(player.fields).map((stat, index) => {
                        //We should have a key for this value, probably a confab of code_name and the stat header.  But since we're 
                        //Not going to update scores in this version we'll leave be for the moment.
                        let code = Object.keys(player.fields)
                        let name_code = Object.values(player.fields)
                        if (expandables.includes(code[index])) {
                            return index === 0 ? <th scope='row' key={code[index]+' '+name_code[1]} >{stat}</th> : <td key={code[index]+' '+name_code[1]}>{stat}</td>
                        }
                    })}
                </tr>
            )}
            </tbody>
        </table>
        </div>
    )
}
