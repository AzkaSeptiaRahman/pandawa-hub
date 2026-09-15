"use client";

import { useEffect, useState } from "react";



export default function AdminPhotoUpload(){


    const [graduates,setGraduates] =
    useState<any[]>([]);


    const [graduateId,setGraduateId] =
    useState("");


    const [type,setType] =
    useState("BEBAS");


    const [file,setFile] =
    useState<File | null>(null);


    const [preview,setPreview] =
    useState("");


    const [message,setMessage] =
    useState("");


    const [loading,setLoading] =
    useState(false);








    useEffect(()=>{


        loadGraduates();


    },[]);









    const loadGraduates = async()=>{


        try{


            const token =
            localStorage.getItem(
                "token"
            );



            const response =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/graduates/options`,

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );





            const data =
            await response.json();





            if(!response.ok){

                setMessage(
                    data.message ||
                    "Failed load graduates"
                );

                return;

            }





            setGraduates(data);



        }catch(error){


            console.error(error);


            setMessage(
                "Cannot load graduates"
            );


        }


    };









    const handleFile = (
        e:React.ChangeEvent<HTMLInputElement>
    )=>{


        const selected =
        e.target.files?.[0];



        console.log(
            "FILE SELECTED",
            selected
        );



        if(!selected){

            return;

        }



        setFile(selected);



        setPreview(

            URL.createObjectURL(
                selected
            )

        );



        setMessage(
            selected.name
        );


    };









    const uploadPhoto = async()=>{


        setMessage("");




        if(!graduateId){


            setMessage(
                "Select graduate first"
            );

            return;

        }





        if(!file){


            setMessage(
                "Please select photo"
            );

            return;

        }







        try{


            setLoading(true);





            const form =
            new FormData();



            form.append(

                "graduate_id",

                graduateId

            );



            form.append(

                "type",

                type

            );



            form.append(

                "file",

                file

            );







            const token =
            localStorage.getItem(
                "token"
            );







            const response =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/photos/upload`,

                {

                    method:"POST",

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    },

                    body:form

                }

            );









            const data =
            await response.json();





            console.log(
                "UPLOAD RESPONSE",
                data
            );







            if(!response.ok){


                setMessage(

                    data.message ||
                    "Upload failed"

                );


                return;

            }







            setMessage(
                "Upload success"
            );



            setFile(null);


            setPreview("");



            const input =
            document.getElementById(
                "photo"
            ) as HTMLInputElement;



            if(input){

                input.value="";

            }





        }catch(error){


            console.error(error);


            setMessage(
                "Server error"
            );



        }finally{


            setLoading(false);


        }



    };









    return(


        <main className="
        min-h-screen
        p-8
        flex
        justify-center
        ">


            <div className="
            glass
            rounded-3xl
            p-10
            w-full
            max-w-xl
            ">



                <h1 className="
                text-3xl
                font-bold
                text-center
                ">

                    Upload Graduate Photo

                </h1>









                <div className="
                mt-8
                space-y-5
                ">






                    <select

                    value={graduateId}

                    onChange={(e)=>
                        setGraduateId(
                            e.target.value
                        )
                    }

                    className="
                    w-full
                    p-4
                    rounded-xl
                    bg-black/30
                    border
                    border-white/20
                    "

                    >


                        <option value="">

                            Select Graduate

                        </option>



                        {

                        graduates.map(
                            (item)=>(


                            <option

                            key={item.id}

                            value={item.id}

                            >

                                {item.graduation_number}
                                {" - "}
                                {item.name}

                            </option>


                            )

                        )

                        }



                    </select>









                    <select

                    value={type}

                    onChange={(e)=>
                        setType(
                            e.target.value
                        )
                    }

                    className="
                    w-full
                    p-4
                    rounded-xl
                    bg-black/30
                    border
                    "

                    >

                        <option value="BEBAS">
                            BEBAS
                        </option>


                        <option value="KUNCIR">
                            KUNCIR
                        </option>


                        <option value="IJAZAH">
                            IJAZAH
                        </option>


                    </select>









                    <label

                    htmlFor="photo"

                    className="
                    block
                    cursor-pointer
                    w-full
                    p-4
                    rounded-xl
                    bg-white/10
                    border
                    border-white/20
                    text-center
                    hover:bg-white/20
                    "

                    >

                        {
                            file
                            ?
                            file.name
                            :
                            "Choose Photo"
                        }


                    </label>





                    <input

                    id="photo"

                    type="file"

                    accept="image/*"

                    onChange={handleFile}

                    className="
                    hidden
                    "

                    />









                    {
                        preview &&


                        <div className="
                        rounded-xl
                        overflow-hidden
                        aspect-square
                        border
                        border-white/20
                        ">


                            <img

                            src={preview}

                            alt="preview"

                            className="
                            w-full
                            h-full
                            object-cover
                            "

                            />


                        </div>

                    }









                    <button

                    onClick={uploadPhoto}

                    disabled={loading}

                    className="
                    w-full
                    py-4
                    rounded-full
                    bg-blue-500/20
                    border
                    "

                    >

                        {

                            loading

                            ?

                            "UPLOADING..."

                            :

                            "UPLOAD PHOTO"

                        }


                    </button>








                    {

                    message &&

                    <p className="
                    text-center
                    text-sm
                    ">

                        {message}

                    </p>

                    }



                </div>




            </div>



        </main>


    );


}