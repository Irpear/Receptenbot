import React from 'react'

import { Link } from 'react-router'

function Home() {
    return (
        <div className="bg-cover bg-center h-[80vh] flex flex-col justify-center items-center">
            <h1 className="fade-in text-white text-4xl md:text-6xl font-bold p-6 drop-shadow-lg">
                Welkom bij receptBot, de ai die je helpt beslissen wat je vanavond gaat eten.
            </h1>

            <Link
                to={`/chatbot`}
                className=" bg-rose-600 text-white px-12 py-5 text-xl rounded-full mt-6 hover:bg-rose-800 transition-all hover:text-white transform duration-1000 hover:scale-150">
                Begin gesprek
            </Link>
        </div>
    )
}

export default Home