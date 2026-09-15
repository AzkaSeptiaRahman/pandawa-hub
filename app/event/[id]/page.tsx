"use client";

import { useRouter } from "next/navigation";


const eventData = {
  id: 2,

  name: "UIN Syarif Hidayatullah Jakarta",

  title: "Dies Natalis 2026",

  date: "20 October 2026",

  thumbnail: "/images/diesnatalis.jpg",


  gallery: [
    "/images/event1.jpg",
    "/images/event2.jpg",
    "/images/event3.jpg",
    "/images/event4.jpg",
    "/images/event5.jpg",
    "/images/event6.jpg",
  ],


  highlights: [
    {
      title: "Live Streaming Dies Natalis 2026",
      url: "https://youtube.com/live/example",
    },

    {
      title: "After Movie Dies Natalis 2026",
      url: "https://youtube.com/watch/example",
    },
  ],

};



export default function EventDetail() {

  const router = useRouter();


  return (

    <main
      className="
        min-h-screen
        p-8
      "
    >



      {/* Back Button */}
      <button
        onClick={() => router.back()}
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





      <div
        className="
          max-w-6xl
          mx-auto
        "
      >




        {/* Event Header */}

        <div
          className="
            glass
            rounded-3xl
            overflow-hidden
          "
        >


          <div
            className="
              h-72
              bg-gradient-to-br
              from-slate-900
              to-blue-600
            "
          >

            <img
              src={eventData.thumbnail}
              alt={eventData.title}
              className="
                w-full
                h-full
                object-cover
              "
            />

          </div>




          <div className="p-8">


            <h1
              className="
                text-4xl
                font-bold
              "
            >
              {eventData.title}
            </h1>



            <p
              className="
                mt-3
                text-slate-400
                text-lg
              "
            >
              {eventData.name}
            </p>



            <div
              className="
                mt-5
                inline-flex
                rounded-full
                bg-blue-500/20
                px-4
                py-2
                text-blue-300
              "
            >
              📅 {eventData.date}
            </div>


          </div>


        </div>







        {/* Gallery */}

        <section className="mt-12">


          <h2
            className="
              text-3xl
              font-bold
            "
          >
            📸 Gallery
          </h2>




          <div
            className="
              grid
              md:grid-cols-3
              gap-6
              mt-6
            "
          >

            {
              eventData.gallery.map((photo,index)=>(

                <div
                  key={index}
                  className="
                    aspect-square
                    rounded-2xl
                    overflow-hidden
                    bg-gradient-to-br
                    from-slate-900
                    to-blue-600
                    cursor-pointer
                    hover:scale-105
                    transition
                  "
                >

                  <img
                    src={photo}
                    alt={`gallery-${index}`}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>


              ))
            }


          </div>


        </section>










        {/* Highlights */}

        {
          eventData.highlights.length > 0 && (

            <section
              className="
                mt-12
                pb-10
              "
            >


              <h2
                className="
                  text-3xl
                  font-bold
                "
              >
                ✨ Highlights
              </h2>




              <div
                className="
                  grid
                  md:grid-cols-3
                  gap-6
                  mt-6
                "
              >


                {
                  eventData.highlights.map((item,index)=>(

                    <div
                      key={index}
                      className="
                        glass
                        rounded-2xl
                        p-6
                        hover:-translate-y-2
                        transition
                      "
                    >


                      <div
                        className="
                          text-5xl
                        "
                      >
                        🎥
                      </div>




                      <h3
                        className="
                          mt-5
                          text-xl
                          font-bold
                        "
                      >
                        {item.title}
                      </h3>




                      <p
                        className="
                          mt-2
                          text-slate-400
                        "
                      >
                        Watch event recording
                      </p>




                      <a
                        href={item.url}
                        target="_blank"
                        className="
                          inline-flex
                          mt-5
                          rounded-full
                          bg-white/10
                          border
                          border-white/20
                          px-5
                          py-2
                          text-white
                          hover:bg-white/20
                          transition
                        "
                      >
                        ▶ Watch
                      </a>



                    </div>


                  ))
                }


              </div>


            </section>

          )
        }



      </div>


    </main>

  );

}