import { useReducer, useRef, useEffect, useState } from 'react';
import './App.css';
const getSecondUrl = ref => {
    // this querySelector is used to find the value character.
    const a = Array.from(
        ref.querySelectorAll(
            'code[data-class^="23"]>div[data-tag$="93"]>span[data-id*="21"]>i.char'
        )
    );
    return a.map(v => v.getAttribute('value')).join('');
};
const reducer = (state, action) => {
    const { type, ...rest } = action;
    switch (type) {
        case 'set': {
            return rest;
        }
    }
    return state;
};
const loadData = async () => {
    const body = await fetch(
        'https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge'
    );
    const data = await body.text();
    return data;
};
const loadAnswer = async url => {
    const body = await fetch(url);
    const data = await body.text();
    return data;
};
function App() {
    const ref = useRef(null);
    const [state, setState] = useReducer(reducer, { status: 'init' });

    useEffect(() => {
        if (state.status === 'init') {
            loadData().then(data => {
                setState({ type: 'set', status: 'loaded', data });
            });
        } else if (state.status === 'loaded') {
            const secondUrl = getSecondUrl(ref.current);
            loadAnswer(secondUrl).then(data => {
                setState({ type: 'set', status: 'calculated', data });
            });
        }
    }, [state.status]);

    return (
        <div>
            {state.status === 'init' ? 'Loading...' : ''}
            {state.status === 'calculated' && state.data ? (
                <Loaded value={state.data} />
            ) : (
                <div
                    ref={ref}
                    dangerouslySetInnerHTML={{ __html: state.data }}
                ></div>
            )}
        </div>
    );
}

export default App;

// eslint-disable-next-line react/prop-types
const Loaded = ({ value = '' }) => {
    const [state, setState] = useState([]);
    const ref = useRef([]);
    useEffect(() => {
        ref.current = value?.split('');
        setState([]);
        const id = setInterval(
            ref => {
                if (ref.current) {
                    if (ref.current.length === 0) {
                        clearInterval(id);
                    } else {
                        const firstLetter = ref.current.shift();
                        setState(state => {
                            return [...state, firstLetter];
                        });
                    }
                }
            },
            500,
            ref
        );
        // }
    }, []);
    return (
        <ul>
            {state.map((v, idx) => (
                <li key={'key' + idx}>{v}</li>
            ))}
        </ul>
    );
};
