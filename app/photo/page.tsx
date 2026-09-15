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









    const reportProblem = ()=>{


        const subject =

        encodeURIComponent(

            `Report Photo - ${data.student.name}`

        );





        const body =

        encodeURIComponent(

`Hello Pandawa Creative Team,

Saya ingin melaporkan masalah terkait foto wisuda.

Detail Mahasiswa:

Nama:
${data.student.name}

Nomor Wisuda:
${data.student.graduation_number}

Fakultas:
${data.student.faculty}

Program Studi:
${data.student.study_program}


Detail masalah:

(Tuliskan masalah foto di sini)


Terima kasih.

`

        );







        window.location.href =

        `mailto:contact@pandawacreative.com?subject=${subject}&body=${body}`;



    };









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

                    onClick={()=>router.push("/")}

                    className="
                    mt-5
                    px-6
                    py-3
                    rounded-full
                    bg-white/10
                    "

                    >

                    Return Home

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
            space-y-10
            ">







                {/* PHOTO CARD */}


                <div className="
                grid
                md:grid-cols-3
                gap-6
                ">



                    <PhotoCard

                    title="📸 Foto Bebas"

                    photo={
                        data.photos.BEBAS?.[0]
                    }

                    />





                    <PhotoCard

                    title="🎓 Foto Kuncir"

                    photo={
                        data.photos.KUNCIR?.[0]
                    }

                    />





                    <PhotoCard

                    title="📜 Foto Ijazah"

                    photo={
                        data.photos.IJAZAH?.[0]
                    }

                    />



                </div>









                {/* STUDENT DETAIL */}


                <div className="
                glass
                rounded-3xl
                p-10
                text-center
                ">



                    <h1 className="
                    text-4xl
                    font-bold
                    ">

                    {data.student.name}

                    </h1>





                    <div className="
                    mt-6
                    space-y-3
                    text-slate-300
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









                {/* BUTTON */}


                <div className="
                flex
                justify-center
                gap-5
                flex-wrap
                pb-10
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

                    onClick={reportProblem}

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









                    <button

                    onClick={()=>router.push("/")}

                    className="
                    rounded-full
                    bg-white/10
                    border
                    border-white/20
                    px-8
                    py-4
                    text-white
                    hover:bg-white/20
                    transition
                    "

                    >

                    RETURN TO HOME

                    </button>






                </div>








            </div>





        </main>


    );


}









function PhotoCard({

    title,

    photo


}:{

    title:string;

    photo:any;

}){


    return(


        <div className="
        glass
        rounded-3xl
        p-5
        ">


            <h2 className="
            text-xl
            font-bold
            text-center
            mb-5
            ">

            {title}

            </h2>







            {

                photo

                ?

                <img

                src={

                    `${process.env.NEXT_PUBLIC_API_URL}${photo.url}`

                }

                alt={title}

                className="
                w-full
                aspect-square
                object-cover
                rounded-2xl
                "

                />

                :


                <div className="
                aspect-square
                rounded-2xl
                bg-black/20
                flex
                items-center
                justify-center
                text-slate-400
                ">

                    No Photo

                </div>


            }






        </div>


    );


}