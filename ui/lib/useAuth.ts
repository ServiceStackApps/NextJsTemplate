import { useEffect } from "react";
import Router from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { client } from "./gateway";
import { Authenticate, AuthenticateResponse } from "./dtos";

const KEY = "/api/Authenticate"
const FORBIDDEN_PATH = "/forbidden"

type Props = {
}
export default function useAuth({ 
}: Props = {}) {
  const { data:auth, mutate, error } = useSWR(KEY, key => client.post(new Authenticate()))
  const { cache } = useSWRConfig();
  const loading = error === undefined && auth === undefined
  const signedIn = error === undefined && auth !== undefined
  
  let attrs:string[] = []
  if (!loading && auth) {
    (auth.roles || []).forEach(role => attrs.push(`role:${role}`));
    (auth.permissions || []).forEach(perm => attrs.push(`perm:${perm}`));
  }

  async function signout(redirectTo?:string) {
    await client.post(new Authenticate({ provider: 'logout' }));
    (cache as any).delete(KEY);
    mutate(); // revalidate
    if (redirectTo) {
      Router.push(redirectTo)
    }
  }

  const hasRole = (role:string) => (auth?.roles || []).indexOf(role) >= 0;
  const hasPermission = (permission:string) => (auth?.permissions || []).indexOf(permission) >= 0;
  
  return { auth, signedIn, attrs, loading, signout, mutate, hasRole, hasPermission }
}