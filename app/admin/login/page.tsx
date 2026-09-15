"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";



export default function AdminLogin(){


    const router = useRouter();



    const [username,setUsername] =
    useState("");



    const [password,setPassword] =
    useState("");



    const [error,setError] =
    useState("");



    const [loading,setLoading] =
    useState(false);








    const handleLogin = async()=>{


        setError("");



        if(
            !username ||
            !password
        ){

            setError(
                "Username and password required"
            );

            return;

        }








        try{


            setLoading(true);




            const response =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },

                    body:JSON.stringify({

                        username,

                        password

                    })

                }

            );








            const data =
            await response.json();







            if(!response.ok){


                setError(

                    data.message ||
                    "Login failed"

                );


                return;


            }








            // SAVE TOKEN


            localStorage.setItem(

                "token",

                data.token

            );







            router.push(
                "/admin/photos"
            );








        }catch(error){


            console.error(error);


            setError(
                "Cannot connect server"
            );


        }finally{


            setLoading(false);


        }



    };









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
            w-full
            max-w-md
            ">





                <h1 className="
                text-3xl
                font-bold
                text-center
                ">

                    Admin Login

                </h1>







                <div className="
                mt-8
                space-y-5
                ">





                    <input

                    value={username}

                    onChange={(e)=>
                        setUsername(
                            e.target.value
                        )
                    }

                    placeholder="Username"

                    className="
                    w-full
                    p-4
                    rounded-xl
                    bg-black/30
                    border
                    border-white/20
                    "

                    />







                    <input

                    type="password"

                    value={password}

                    onChange={(e)=>
                        setPassword(
                            e.target.value
                        )
                    }

                    placeholder="Password"

                    className="
                    w-full
                    p-4
                    rounded-xl
                    bg-black/30
                    border
                    border-white/20
                    "

                    />








                    {
                        error &&

                        <div className="
                        text-red-300
                        text-center
                        ">

                            {error}

                        </div>

                    }









                    <button

                    onClick={handleLogin}

                    className="
                    w-full
                    py-4
                    rounded-full
                    bg-blue-500/20
                    border
                    border-blue-400/30
                    "

                    >

                        {
                            loading
                            ?
                            "LOGIN..."
                            :
                            "LOGIN"
                        }

                    </button>







                </div>





            </div>





        </main>


    );


}