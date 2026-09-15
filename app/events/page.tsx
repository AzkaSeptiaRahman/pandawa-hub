"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const events = [
  {
    name: "UIN Syarif Hidayatullah Jakarta",
    title: "Wisuda ke-141",
    date: "5-6 & 12-13 September 2026",
  },
  {
    name: "UIN Syarif Hidayatullah Jakarta",
    title: "Wisuda ke-140",
    date: "2026",
  },
  {
    name: "Polytechnic DEF",
    title: "Graduation Ceremony",
    date: "2026",
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

  return (
    <main className="min-h-screen p-10">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="
          fixed
          top-8
          left-8
          z-50
          flex
          items-center
          gap-2
          rounded-full
          bg-white/10
          border
          border-white/20
          px-5
          py-3
          text-slate-200
          backdrop-blur-xl
          hover:bg-white/20
          transition
        "
      >
        ← Back
      </button>


      {/* Header */}
      <h1 className="text-5xl font-bold text-center">
        Select Your Event
      </h1>

      <p className="text-center text-slate-400 mt-3">
        Access photos, videos, and livestream recordings from your special moments
      </p>


      {/* Search Bar */}
      <div className="max-w-xl mx-auto mt-10">

        <div
          className="
            flex
            items-center
            rounded-2xl
            bg-white/10
            border
            border-white/20
            backdrop-blur-xl
            px-5
            py-4
            shadow-lg
          "
        >

          <span className="text-xl mr-3">
            🔍
          </span>


          <input
            type="text"
            placeholder="Search event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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



      {/* Event Cards */}
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

        {filteredEvents.map((event, i) => (

          <div
            key={i}
            onClick={() => router.push("/search")}
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


            {/* Icon Area */}
            <div
              className="
                h-52
                bg-gradient-to-br
                from-slate-900
                to-blue-600
                flex
                items-center
                justify-center
                text-7xl
                animate-float
              "
            >
              🎓
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
                  text-slate-300
                  mt-3
                  text-lg
                "
              >
                {event.title}
              </p>



              <div
                className="
                  mt-4
                  inline-flex
                  items-center
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


            </div>


          </div>

        ))}

      </div>



      {/* No Result */}
      {filteredEvents.length === 0 && (

        <div
          className="
            text-center
            text-slate-400
            mt-14
            text-lg
          "
        >
          Event tidak ditemukan 🔍
        </div>

      )}


    </main>
  );
}