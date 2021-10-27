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
            setResult(!name ? '' : (await client.get(new Hello({ name }) )).result)
        })();
    }, [name]); // fires when name changes

    const handleChange = (name: any) => {
        console.log(name.target.value)
        setName(name.target.value);
    }

    return (<div>
        <div className="form-group" role="form">
            <input id="txtName" value={name} onChange={handleChange} placeholder="Your name" />
            <h3 className="result pt-2">{ result }</h3>
        </div>
    </div>);

}