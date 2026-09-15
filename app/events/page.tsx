"use client";


import {
    useEffect,
    useState
} from "react";


import {
    useRouter
} from "next/navigation";





export default function EventsPage(){


    const router =
    useRouter();



    const [events,setEvents] =
    useState<any[]>([]);



    const [search,setSearch] =
    useState("");



    const [loading,setLoading] =
    useState(true);







    useEffect(()=>{


        loadEvents();


    },[]);









    const loadEvents = async()=>{


        try{


            const res =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/events`

            );



            const data =
            await res.json();




            setEvents(

                data.events || data

            );




        }catch(error){


            console.error(error);


        }finally{


            setLoading(false);


        }


    };









    const openEvent = (event:any) => {

    if(event.type === "PERSONAL"){

        router.push(
            `/search?event=${event.id}`
        );

        return;
    }

    if(event.type === "GALLERY"){

        router.push(
            `/gallery/${event.slug}`
        );

        return;
    }

};









    const filteredEvents =

    events.filter((event)=>{


        return (

            event.name

            ?

            event.name

            .toLowerCase()

            .includes(

                search.toLowerCase()

            )

            :

            false

        );


    });











    if(loading){


        return(

            <main className="
            min-h-screen
            flex
            items-center
            justify-center
            ">

                Loading...

            </main>

        );


    }









    return(


        <main className="
        min-h-screen
        p-8
        ">





            <div className="
            max-w-5xl
            mx-auto
            ">



                <h1 className="
                text-6xl
                font-bold
                text-center
                ">


                    Select Your Event


                </h1>






                <p className="
                text-center
                text-slate-400
                mt-5
                ">


                    Access photos, videos, and livestream recordings from your special moments


                </p>









                <input


                placeholder="Search event..."


                value={search}


                onChange={(e)=>
                    setSearch(
                        e.target.value
                    )
                }


                className="
                mt-12
                w-full
                p-5
                rounded-3xl
                bg-white/10
                border
                border-white/20
                "


                />












                <div className="
                grid
                md:grid-cols-3
                gap-8
                mt-14
                ">





                {


                filteredEvents.map((event)=>(



                    <div


                    key={event.id}


                    onClick={()=>openEvent(event)}


                    className="
                    cursor-pointer
                    rounded-3xl
                    overflow-hidden
                    bg-white/10
                    border
                    border-white/20
                    hover:scale-105
                    transition
                    ">



                        <div className="
                        h-56
                        bg-blue-700
                        ">


                        {


                        event.thumbnail &&


                        <img


                        src={

`${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`

                        }


                        className="
                        w-full
                        h-full
                        object-cover
                        "


                        />


                        }



                        </div>









                        <div className="
                        p-6
                        ">



                            <h2 className="
                            text-2xl
                            font-bold
                            ">


                                {event.name}


                            </h2>







                            <p className="
                            text-slate-300
                            mt-3
                            ">


                                {event.title}


                            </p>








                            <div className="
                            flex
                            gap-3
                            mt-5
                            flex-wrap
                            ">



                                <span className="
                                px-4
                                py-2
                                rounded-full
                                bg-blue-500/20
                                ">


                                📅 {event.date}


                                </span>








                                <span className="
                                px-4
                                py-2
                                rounded-full
                                bg-white/10
                                ">


                                {


                                event.type === "PERSONAL"

                                ?

                                "🎓 Personal Photo"

                                :

                                "📸 Gallery & Live"


                                }


                                </span>






                            </div>





                        </div>






                    </div>



                ))


                }




                </div>





            </div>




        </main>


    );


}