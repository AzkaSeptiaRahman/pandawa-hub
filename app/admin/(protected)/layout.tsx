"use client";


import Link from "next/link";

import {
    usePathname,
    useRouter
} from "next/navigation";


import {
    useEffect,
    useState
} from "react";








export default function AdminLayout({

    children

}:{

    children:React.ReactNode;

}){



    const router = useRouter();


    const pathname =
    usePathname();





    const [checking,setChecking] =
    useState(true);









    const menus = [



        {
            name:"Dashboard",
            path:"/admin"
        },



        {
            name:"Events",
            path:"/admin/events"
        },



        {
            name:"Manage Event",
            path:"/admin/events/manage"
        },



        {
            name:"Graduates",
            path:"/admin/graduates"
        },



        {
            name:"Upload Photo",
            path:"/admin/photos"
        },



        {
            name:"Bulk Photo Upload",
            path:"/admin/photos/bulk"
        }



    ];









    useEffect(()=>{


        checkSession();


    },[]);









    const checkSession = ()=>{


        const token =
        localStorage.getItem(
            "token"
        );





        if(!token){


            router.replace(
                "/admin/login"
            );


            return;


        }





        setChecking(false);


    };









    const logout = ()=>{


        localStorage.removeItem(
            "token"
        );


        router.replace(
            "/admin/login"
        );


    };












    if(checking){


        return(

            <main

            className="
            min-h-screen
            flex
            items-center
            justify-center
            "

            >

                Checking session...


            </main>

        );


    }












    return(


        <div

        className="
        min-h-screen
        flex
        "

        >







            {/* SIDEBAR */}



            <aside

            className="
            w-72
            min-h-screen
            glass
            border-r
            border-white/10
            p-6
            flex
            flex-col
            "

            >





                <div>



                    <h1

                    className="
                    text-3xl
                    font-bold
                    mb-2
                    "

                    >

                        Pandawa CMS


                    </h1>






                    <p

                    className="
                    text-sm
                    text-slate-400
                    mb-10
                    "

                    >

                        Graduation Management


                    </p>









                    <nav

                    className="
                    space-y-3
                    "

                    >





                    {

                        menus.map(

                            (item)=>(



                            <Link

                            key={item.path}

                            href={item.path}



                            className={`

                            block

                            px-5

                            py-3

                            rounded-xl

                            transition


                            ${

                            pathname === item.path ||

                            pathname.startsWith(
                                item.path + "/"
                            )

                            ?

                            "bg-white/20 text-white"

                            :

                            "text-slate-400 hover:bg-white/10"

                            }


                            `}


                            >

                                {item.name}


                            </Link>



                            )

                        )

                    }







                    </nav>





                </div>
















                <button

                onClick={logout}

                className="

                mt-auto

                w-full

                rounded-xl

                px-5

                py-3

                bg-red-500/20

                border

                border-red-400/30

                text-red-300

                hover:bg-red-500/30

                "

                >


                    Logout


                </button>











            </aside>















            <main

            className="

            flex-1

            p-8

            "

            >


                {children}


            </main>








        </div>


    );


}