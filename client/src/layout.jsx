import React from 'react'

import {Link, Outlet} from "react-router"

function Layout() {
    return (
        <>
            <nav className="p-4">
                <div className="max-w-screen-xl mx-auto flex items-center justify-around text-xl font-semibold">
                    <Link to={"/"} className="hover:text-rose-800 hover:animate-pulse">Home</Link>
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>
        </>
    )

}

export default Layout