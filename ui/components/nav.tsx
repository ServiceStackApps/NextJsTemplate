import Link from 'next/link'
import useAuth from '../lib/useAuth'

export default function () {

    let items:{href?:string,name:string,onClick?:(e:any) => void}[] = [
        { href: '/', name: 'home' },
        { href: '/about', name: 'about'},
    ]

    let { auth, signout } = useAuth()
    if (auth) {
        items.push(...[
            { href:"/profile", name:"profile" },
            { href:"/admin", name:"admin" },
            { onClick: (e:any) => signout('/'), name:"sign out" },
        ])
    } else {
        items.push({ href:"/signin", name:"sign in" })
    }

    return (<div>
        <ul className="flex justify-end m-2 gap-x-2">
            {items.map(x => <li key={x.name}>{x.href 
                ? <Link href={x.href}><a className="hover:underline">{x.name}</a></Link> 
                : <span className="cursor-pointer hover:underline" onClick={x.onClick}>{x.name}</span>}
            </li>)}
        </ul>
    </div>)
}
