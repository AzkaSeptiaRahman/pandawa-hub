"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const events = [
  {
    id: 1,
    name: "UIN Syarif Hidayatullah Jakarta",
    title: "Wisuda ke-141",
    date: "5-6 & 12-13 September 2026",
    type: "special",
    image: "/images/wisuda141.jpg",
  },

  {
    id: 2,
    name: "UIN Syarif Hidayatullah Jakarta",
    title: "Dies Natalis 2026",
    date: "20 October 2026",
    type: "public",
    image: "/images/diesnatalis.jpg",
  },

  {
    id: 3,
    name: "Polytechnic DEF",
    title: "Graduation Ceremony",
    date: "2026",
    type: "public",
    image: "/images/graduation.jpg",
  },
];


export default function Events() {

  const router = useRouter();

  const [search, setSearch] = useState("");


  const filteredEvents = events.filter((event) =>
    `${event.name} ${event.title} ${event.date}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const handleEventClick = (event:any) => {

    if(event.type === "special"){

      router.push(`/search?event=${event.id}`);

    }

    else{

      router.push(`/event/${event.id}`);

    }

  };


  return (

    <main
      className="
        min-h-screen
        p-10
        relative
      "
    >


      {/* Back Button */}
      <button
        onClick={()=>router.back()}
        className="
          fixed
          top-8
          left-8
          z-50
          rounded-full
          bg-white/10
          border
          border-white/20
          backdrop-blur-xl
          px-5
          py-3
          text-white
          hover:bg-white/20
          transition
        "
      >
        ← Back
      </button>




      {/* Header */}
      <div className="text-center">


        <h1
          className="
            text-5xl
            font-bold
          "
        >
          Select Your Event
        </h1>


        <p
          className="
            mt-3
            text-slate-400
          "
        >
          Access photos, videos, and livestream recordings from your special moments
        </p>


      </div>





      {/* Search */}
      <div
        className="
          max-w-xl
          mx-auto
          mt-10
        "
      >

        <div
          className="
            flex
            items-center
            rounded-2xl
            bg-white/10
            border
            border-white/20
            px-5
            py-4
            backdrop-blur-xl
          "
        >

          <span className="mr-3">
            🔍
          </span>


          <input

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            placeholder="Search event..."

            className="
              w-full
              bg-transparent
              outline-none
              text-white
              placeholder:text-slate-400
            "

          />


        </div>


      </div>






      {/* Cards */}
      <div
        className="
          grid
          md:grid-cols-3
          gap-8
          max-w-6xl
          mx-auto
          mt-14
        "
      >


        {
          filteredEvents.map((event)=>(
            
            <div

              key={event.id}

              onClick={()=>handleEventClick(event)}

              className="
                glass
                rounded-3xl
                overflow-hidden
                cursor-pointer
                hover:-translate-y-3
                transition
                duration-300
                shadow-[0_20px_60px_rgba(0,0,0,.3)]
              "

            >


              {/* Thumbnail */}

              <div
                className="
                  h-52
                  overflow-hidden
                  bg-gradient-to-br
                  from-slate-900
                  to-blue-600
                "
              >

                <img

                  src={event.image}

                  alt={event.title}

                  className="
                    w-full
                    h-full
                    object-cover
                    hover:scale-110
                    transition
                    duration-500
                  "

                />


              </div>





              {/* Content */}

              <div className="p-7">


                <h2
                  className="
                    text-2xl
                    font-bold
                    leading-tight
                  "
                >
                  {event.name}
                </h2>




                <p
                  className="
                    mt-3
                    text-lg
                    text-slate-300
                  "
                >
                  {event.title}
                </p>





                <div
                  className="
                    mt-4
                    inline-flex
                    rounded-full
                    bg-blue-500/20
                    px-4
                    py-2
                    text-sm
                    text-blue-300
                  "
                >

                  📅 {event.date}

                </div>





                {/* Event Type */}

                <div
                  className="
                    mt-3
                    inline-flex
                    rounded-full
                    bg-white/10
                    px-4
                    py-2
                    text-sm
                    text-slate-200
                  "
                >

                  {
                    event.type === "special"
                    ?
                    "🎓 Personal Photo"
                    :
                    "📸 Gallery & Live"
                  }


                </div>


              </div>


            </div>

          ))
        }


      </div>





      {
        filteredEvents.length === 0 && (

          <div
            className="
              text-center
              mt-10
              text-slate-400
            "
          >
            Event tidak ditemukan 🔍
          </div>

        )
      }



    </main>

  );

}