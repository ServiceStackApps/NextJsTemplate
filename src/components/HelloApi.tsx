import * as React from 'react';
import {client} from "../shared";
import { Hello } from '../shared/dtos';

export interface HelloApiProps {
    name: string;
}

export default function HelloApi(props:HelloApiProps) {
    const [name, setName] = React.useState(props.name);
    const [result, setResult] = React.useState('');

    React.useEffect(() => {
        (async () => {
            console.log(name)
            if(!name) {
                setResult('')
            } else {
                let response = await client.get(new Hello({ name }) );
                console.log(response)
                setResult(response.result)
            }
        })();
    }, [name]); // fires when name changes

    return (<div>
        <div className="form-group" role="form">
            <input id="txtName" value={name} onInput={e => setName(e.currentTarget.value)} placeholder="Your name" />
            <h3 className="result pt-2">{ result }</h3>
        </div>
    </div>);

}