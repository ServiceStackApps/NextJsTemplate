import { useState } from 'react';

export default function HelloApi() {
    const [name, setName] = useState('');
    return (
        <>

            <div>Hello, {name}!</div>
            <style jsx>{`
        div {
          background-color: #111;
          border-radius: 0.5em;
          color: #fff;
          margin-bottom: 1.5em;
          padding: 0.5em 0.75em;
        }
      `}</style>
        </>
    )
}