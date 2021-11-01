import { useEffect } from "react";
import Router from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { client } from "./gateway";
import { Authenticate, AuthenticateResponse } from "./dtos";

const KEY = "/api/Authenticate"

type Props = {
    redirectTo?: string,
    redirectToIfAuthenticated?: string,
}
export default function useAuth({ 
  redirectTo, 
  redirectToIfAuthenticated 
}: Props = {}) {
  const { data, mutate, error } = useSWR(KEY, key => client.post(new Authenticate()))
  const { cache } = useSWRConfig();
  let auth = data as AuthenticateResponse
  const loading = auth === undefined && error === undefined

  async function signout(redirectTo?:string) {
    if (redirectTo) {
      Router.push(redirectTo)
    }
    await client.post(new Authenticate({ provider: 'logout' }));
    (cache as any).delete(KEY);
    mutate(undefined, true);    // revalidate
  }
  
  function handleAuth() {
    if (loading) return
    if (!auth && redirectTo) {
      Router.push(redirectTo) 
    } else if (auth && redirectToIfAuthenticated) {
      Router.push(redirectToIfAuthenticated) 
    }
  }  
  useEffect(handleAuth, [auth, loading])

  return { auth, loading, signout }
}