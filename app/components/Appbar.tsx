"use client"; // we have onClick here, this runs only on the client side; so we need to import it.
import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar() {
    const session = useSession();
    return <div>
        <div className="flex justify-between">
            <div>
                Blogg
            </div>
            <div>
                {session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>Logout</button>}
                {!session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={() => signIn()}>SignIn</button>}
            </div>
        </div>
    </div>
}