import { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import throttle from 'lodash.throttle';
import { Cursor } from './components/Cursor.jsx';

const renderCursors = users => {
    return Object.keys(users).map(uuid => {
        const user = users[uuid];

        return (
            <Cursor key={uuid} point={[user.state.x, user.state.y]} />
        )
    })
}

const renderUsersList = users => {
    return (
      <ul>
        {Object.keys(users).map(uuid => {
          return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
        })}
      </ul>
    )
  }

export function Home({username}) {
    const WS_URL = 'ws://127.0.0.1:8000';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { username }
    });

    const THROTTLE = 50;
    const sendJSONMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

    useEffect(() => {
        sendJsonMessage({
            x: 0,
            y: 0
        })
        window.addEventListener("mousemove", e => {
            sendJSONMessageThrottled.current({
                x: e.clientX,
                y: e.clientY
            })
        })
    }, [])


    if(lastJsonMessage) {
        return <>
            {renderCursors(lastJsonMessage)}
            {renderUsersList(lastJsonMessage)}
        </>
    }
    return <h1>Hello {username}</h1>
}