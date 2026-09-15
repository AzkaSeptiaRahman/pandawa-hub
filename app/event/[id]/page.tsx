"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function EventDetail() {


  const router = useRouter();

  const params = useParams();


  const [event, setEvent] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");




  useEffect(() => {


    const fetchEvent = async () => {


      try {


        const response = await fetch(
          `http://localhost:5000/api/events/${params.id}`
        );



        if(!response.ok){

          throw new Error(
            "Event not found"
          );

        }



        const data = await response.json();



        setEvent(data);



      } catch(err:any){


        setError(err.message);



      } finally {


        setLoading(false);


      }


    };



    if(params.id){

      fetchEvent();

    }



  }, [params.id]);









  if(loading){


    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <p className="text-slate-400">
          Loading event...
        </p>


      </main>

    );


  }







  if(error || !event){


    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          p-8
        "
      >

        <div
          className="
            glass
            rounded-3xl
            p-10
            text-center
          "
        >

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Event Not Found
          </h1>


          <button
            onClick={()=>router.back()}
            className="
              mt-6
              rounded-full
              bg-white/10
              px-6
              py-3
            "
          >
            ← Back
          </button>


        </div>


      </main>

    );


  }









  const gallery = event.media?.filter(
    (item:any)=>item.type === "gallery"
  ) || [];



  const highlights = event.media?.filter(
    (item:any)=>item.type === "highlight"
  ) || [];









  return (

    <main
      className="
        min-h-screen
        p-8
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









      <div
        className="
          max-w-6xl
          mx-auto
        "
      >








        {/* Hero */}


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


            {
              event.thumbnail && (

                <img

                  src={event.thumbnail}

                  alt={event.title}

                  className="
                    w-full
                    h-full
                    object-cover
                  "

                />

              )
            }


          </div>





          <div className="p-8">


            <h1
              className="
                text-4xl
                font-bold
              "
            >
              {event.title}
            </h1>




            <p
              className="
                mt-3
                text-slate-400
                text-lg
              "
            >
              {event.name}
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

              📅 {event.date}

            </div>



          </div>



        </div>









        {/* Gallery */}


        {
          gallery.length > 0 && (

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
                  gallery.map((item:any,index:number)=>(


                    <div

                      key={index}

                      className="
                        aspect-square
                        rounded-2xl
                        overflow-hidden
                        bg-gradient-to-br
                        from-slate-900
                        to-blue-600
                        hover:scale-105
                        transition
                      "

                    >


                      <img

                        src={item.url}

                        alt={item.title}

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


          )
        }









        {/* Highlights */}


        {
          highlights.length > 0 && (


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
                  highlights.map((item:any,index:number)=>(


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


                      <div className="text-5xl">
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