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
            if(!name) {
                setResult('')
            } else {
                let response = await client.get(new Hello({ name }) );
                setResult(response.result)
            }
        })();
    }, [name]); // fires when name changes

    return (<div>
        <div className="form-group" role="form">
            <input id="txtName" value={name} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   onInput={e => setName(e.currentTarget.value)} placeholder="Your name" />
            <h3 className="block text-gray-700 text-lg font-bold mb-2">{ result }</h3>
        </div>
    </div>);

}