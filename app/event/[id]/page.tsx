"use client";


import {
    useEffect,
    useState
} from "react";


import {
    useParams,
    useRouter
} from "next/navigation";








export default function EventDetail(){


    const router =
    useRouter();


    const params =
    useParams();



    const id =
    params.id;






    const [event,setEvent] =
    useState<any>(null);



    const [loading,setLoading] =
    useState(true);



    const [error,setError] =
    useState("");









    useEffect(()=>{


        if(id){

            loadEvent();

        }


    },[id]);









    const loadEvent = async()=>{


        try{


            const response =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`

            );




            const result =
            await response.json();





            console.log(

                "EVENT DETAIL:",

                result

            );






            if(!response.ok){


                throw new Error(

                    result.message ||

                    "Event not found"

                );


            }






            setEvent(result);





        }catch(error:any){



            console.error(error);



            setError(

                error.message

            );



        }finally{


            setLoading(false);


        }



    };









    const imageUrl=(url:string)=>{


        if(!url){

            return "";

        }




        return url.startsWith("http")

        ?

        url

        :

        `${process.env.NEXT_PUBLIC_API_URL}${url}`;


    };









    const youtubeThumbnail=(url:string)=>{


        if(!url){

            return "";

        }





        const match =

        url.match(

            /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/

        );





        if(!match){

            return "";

        }





        return (

            `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`

        );


    };












    if(loading){


        return(

            <main className="
            min-h-screen
            flex
            items-center
            justify-center
            ">

                Loading event...

            </main>

        );


    }









    if(error || !event){


        return(

            <main className="
            min-h-screen
            flex
            items-center
            justify-center
            p-8
            ">


                <div className="
                glass
                rounded-3xl
                p-10
                text-center
                ">


                    <h1 className="
                    text-3xl
                    font-bold
                    ">

                    Event Not Found

                    </h1>




                    <p className="
                    mt-3
                    text-slate-400
                    ">

                    {error}

                    </p>





                    <button

                    onClick={()=>router.back()}

                    className="
                    mt-6
                    px-6
                    py-3
                    rounded-full
                    bg-white/10
                    "

                    >

                    Back

                    </button>



                </div>


            </main>

        );


    }









    const gallery =

    event.media?.filter(

        (item:any)=>

        item.type === "gallery"

    ) || [];







    const highlights =

    event.media?.filter(

        (item:any)=>

        item.type === "highlight"

    ) || [];









    return(


        <main className="
        min-h-screen
        p-8
        ">





            <button

            onClick={()=>router.back()}

            className="
            fixed
            top-8
            left-8
            z-50
            px-5
            py-3
            rounded-full
            bg-white/10
            border
            border-white/20
            "

            >

                ← Back

            </button>









            <div className="
            max-w-7xl
            mx-auto
            space-y-12
            ">









                {/* EVENT HEADER */}


                <section className="
                glass
                rounded-3xl
                overflow-hidden
                ">





                    <div className="
                    h-96
                    bg-black/20
                    ">


                    {

                    event.thumbnail &&


                    <img

                    src={
                        imageUrl(
                            event.thumbnail
                        )
                    }


                    alt="event"


                    className="
                    w-full
                    h-full
                    object-cover
                    "

                    />


                    }



                    </div>








                    <div className="
                    p-10
                    text-center
                    ">


                        <h1 className="
                        text-5xl
                        font-bold
                        ">


                            {
                                event.title ||

                                event.name
                            }


                        </h1>







                        {

                        event.description &&


                        <p className="
                        mt-5
                        text-slate-400
                        text-lg
                        ">


                            {event.description}


                        </p>


                        }







                        <div className="
                        mt-6
                        inline-block
                        px-5
                        py-2
                        rounded-full
                        bg-purple-500/20
                        text-purple-300
                        ">

                            📸 Gallery & Live

                        </div>





                    </div>



                </section>












                {/* GALLERY */}



                <section>


                    <h2 className="
                    text-3xl
                    font-bold
                    mb-6
                    ">

                    📸 Event Gallery

                    </h2>







                    {

                    gallery.length === 0


                    ?


                    <div className="
                    glass
                    rounded-3xl
                    p-10
                    text-center
                    text-slate-400
                    ">

                        No gallery uploaded yet

                    </div>



                    :



                    <div className="
                    grid
                    md:grid-cols-3
                    gap-6
                    ">



                    {

                    gallery.map(

                    (item:any)=>(


                        <div

                        key={item.id}

                        className="
                        aspect-square
                        rounded-3xl
                        overflow-hidden
                        "

                        >



                            <img

                            src={

                                imageUrl(

                                    item.url

                                )

                            }


                            alt="gallery"


                            className="
                            w-full
                            h-full
                            object-cover
                            hover:scale-105
                            transition
                            "

                            />



                        </div>


                    )


                    )

                    }



                    </div>


                    }




                </section>













                {/* HIGHLIGHT */}



                <section>


                    <h2 className="
                    text-3xl
                    font-bold
                    mb-6
                    ">

                    ✨ Event Highlight

                    </h2>








                    {

                    highlights.length === 0


                    ?


                    <div className="
                    glass
                    rounded-3xl
                    p-10
                    text-center
                    text-slate-400
                    ">


                        No highlight available


                    </div>





                    :



                    <div className="
                    grid
                    md:grid-cols-2
                    gap-6
                    ">





                    {

                    highlights.map(

                    (item:any)=>(



                        <div

                        key={item.id}

                        className="
                        glass
                        rounded-3xl
                        overflow-hidden
                        "

                        >






                            {

                            youtubeThumbnail(item.url)

                            &&


                            <img

                            src={

                                youtubeThumbnail(

                                    item.url

                                )

                            }


                            className="
                            w-full
                            h-56
                            object-cover
                            "

                            />


                            }







                            <div className="
                            p-8
                            ">


                                <h3 className="
                                text-2xl
                                font-bold
                                ">


                                    {item.title}


                                </h3>






                                <a

                                href={item.url}

                                target="_blank"

                                className="
                                inline-block
                                mt-6
                                px-6
                                py-3
                                rounded-full
                                bg-white/10
                                "

                                >

                                    ▶ Watch

                                </a>




                            </div>





                        </div>



                    )

                    )


                    }





                    </div>



                    }




                </section>









            </div>






        </main>


    );


}