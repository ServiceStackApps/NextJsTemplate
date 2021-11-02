import Page from '../components/layout-page'
import useAuth from '../lib/useAuth'
import Router from 'next/router'
import { UserIcon } from '@heroicons/react/outline'
import React, { useEffect } from 'react'
import { Button, Redirecting } from '../components/form'

export default () => {
    const { auth, signedIn, signout } = useAuth();
    useEffect(() => {
        if (!signedIn) Router.replace("/signin?redirect=/profile");
    }, [signedIn]);
    if (!auth) return <Redirecting />

    return (<Page title={auth?.displayName + ' Profile'}>

        <div className="flex flex-col items-center justify-center">
            <UserIcon className="w-36 h-36 text-gray-700" />
            <div>{auth.displayName}</div>
            <div>{auth.userName}</div>
            <div className="mt-2">
                {(auth.roles || []).map(role => 
                <span key={role} className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-indigo-800">{role}</span>)}
            </div>
            <Button className="mt-8" onClick={(e:any) => signout('/')}>Sign Out</Button>
        </div>

    </Page>)
}