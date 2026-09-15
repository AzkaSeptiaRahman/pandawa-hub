"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function Photo(){


    const router = useRouter();


    const [data,setData] =
    useState<any>(null);


    const [loading,setLoading] =
    useState(true);


    const [error,setError] =
    useState("");






    useEffect(()=>{


        const loadPhoto = async()=>{


            try{


                const saved =
                sessionStorage.getItem(
                    "photoSearch"
                );



                if(!saved){

                    setError(
                        "Search data not found"
                    );

                    return;

                }






                const response =
                await fetch(

                    `${process.env.NEXT_PUBLIC_API_URL}/api/photos/search`,

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":
                            "application/json"

                        },

                        body:saved

                    }

                );








                const result =
                await response.json();






                if(!response.ok){


                    setError(
                        result.message ||
                        "Photo not found"
                    );

                    return;


                }







                setData(result);






            }catch(error){


                console.error(error);


                setError(
                    "Cannot connect to server"
                );


            }finally{


                setLoading(false);


            }



        };



        loadPhoto();



    },[]);









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









    if(error || !data){


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
                    text-2xl
                    font-bold
                    ">

                        {error}

                    </h1>



                    <button

                    onClick={()=>
                        router.push("/events")
                    }

                    className="
                    mt-5
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
            rounded-full
            bg-white/10
            border
            border-white/20
            px-5
            py-3
            text-white
            backdrop-blur-xl
            "

            >

                ← Back

            </button>










            <div className="
            max-w-6xl
            mx-auto
            ">








                {/* STUDENT CARD */}


                <div className="
                glass
                rounded-3xl
                p-8
                text-center
                shadow-xl
                ">


                    <h1 className="
                    text-4xl
                    font-bold
                    ">

                        {data.student.name}

                    </h1>





                    <div className="
                    mt-5
                    text-slate-300
                    space-y-2
                    ">


                        <p>

                            Graduation Number:
                            {" "}
                            {data.student.graduation_number}

                        </p>



                        <p>

                            Faculty:
                            {" "}
                            {data.student.faculty}

                        </p>




                        <p>

                            Program:
                            {" "}
                            {data.student.study_program}

                        </p>


                    </div>



                </div>












                {/* PHOTO CARD */}



                <PhotoCategory

                title="📸 Foto Bebas"

                subtitle="Foto bebas wisuda"

                photos={
                    data.photos.BEBAS
                }

                />






                <PhotoCategory

                title="🎓 Foto Kuncir"

                subtitle="Foto prosesi kuncir"

                photos={
                    data.photos.KUNCIR
                }

                />







                <PhotoCategory

                title="📜 Foto Ijazah"

                subtitle="Foto ijazah resmi"

                photos={
                    data.photos.IJAZAH
                }

                />









                {/* BUTTON */}


                <div className="
                flex
                justify-center
                gap-5
                mt-14
                pb-10
                flex-wrap
                ">





                    <button

                    onClick={()=>{


                        window.open(

                            `${process.env.NEXT_PUBLIC_API_URL}/api/download/${data.student.id}`,

                            "_blank"

                        );


                    }}

                    className="
                    rounded-full
                    bg-blue-500/20
                    border
                    border-blue-400/30
                    px-8
                    py-4
                    text-blue-300
                    hover:bg-blue-500/30
                    transition
                    "

                    >

                        DOWNLOAD ALL PHOTOS

                    </button>







                    <button

                    onClick={()=>{

                        alert(
                            "Report sent to administrator"
                        );

                    }}

                    className="
                    rounded-full
                    bg-red-500/20
                    border
                    border-red-400/30
                    px-8
                    py-4
                    text-red-300
                    hover:bg-red-500/30
                    transition
                    "

                    >

                        REPORT PROBLEM

                    </button>




                </div>






            </div>





        </main>


    );


}









function PhotoCategory({

    title,

    subtitle,

    photos


}:{

    title:string;

    subtitle:string;

    photos:any[];

}){







    return(

        <section className="
        mt-12
        ">





            <div className="
            glass
            rounded-3xl
            p-6
            ">



                <div className="mb-6">


                    <h2 className="
                    text-3xl
                    font-bold
                    ">

                        {title}

                    </h2>


                    <p className="
                    text-slate-400
                    mt-2
                    ">

                        {subtitle}

                    </p>


                </div>









                {

                    !photos ||
                    photos.length===0

                    ?

                    (

                    <div className="
                    rounded-2xl
                    bg-black/20
                    border
                    border-white/10
                    p-8
                    text-center
                    text-slate-400
                    ">

                        No photo available

                    </div>

                    )

                    :

                    (

                    <div className="
                    grid
                    md:grid-cols-3
                    gap-6
                    ">


                    {
                        photos.map((photo,index)=>(


                            <div

                            key={index}

                            className="
                            rounded-2xl
                            overflow-hidden
                            bg-black/20
                            border
                            border-white/10
                            aspect-square
                            group
                            "

                            >


                                <img

                                src={

                                    `${process.env.NEXT_PUBLIC_API_URL}${photo.url}`

                                }

                                alt="Graduation Photo"

                                className="
                                w-full
                                h-full
                                object-cover
                                group-hover:scale-110
                                transition
                                duration-500
                                "

                                />



                            </div>


                        ))
                    }


                    </div>

                    )


                }



            </div>





        </section>


    );


}