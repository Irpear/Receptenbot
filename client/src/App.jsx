
import { createBrowserRouter, RouterProvider} from "react-router"
import React from 'react'

import Home from "./home.jsx"
import Layout from "./layout.jsx"
import Chat from "./chat.jsx"




const router = createBrowserRouter([{
    element:<Layout />,
    children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/chatbot",
            element: <Chat />
        }
    ]
}])


function App() {

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
