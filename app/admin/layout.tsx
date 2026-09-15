"use client";

import Link from "next/link";

import {
    usePathname,
    useRouter
} from "next/navigation";





export default function AdminLayout({

    children

}:{

    children:React.ReactNode;

}){


    const pathname =
    usePathname();



    const router =
    useRouter();





    const isLoginPage =
    pathname === "/admin/login";







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
            name:"Graduates",
            path:"/admin/graduates"
        },


        {
            name:"Upload Photo",
            path:"/admin/photos/upload"
        },


        {
            name:"Bulk Photo Upload",
            path:"/admin/photos/bulk"
        },


        {
            name:"Manage Photos",
            path:"/admin/photos"
        },


        {
            name:"Reports",
            path:"/admin/reports"
        }


    ];







    const logout = ()=>{


        localStorage.removeItem(
            "token"
        );


        router.push(
            "/admin/login"
        );


    };









    // LOGIN TANPA SIDEBAR

    if(isLoginPage){


        return(

            <main className="
            min-h-screen
            ">

                {children}

            </main>

        );


    }









    return(


        <div className="
        min-h-screen
        flex
        ">




            <aside className="
            w-72
            min-h-screen
            glass
            border-r
            border-white/10
            p-6
            flex
            flex-col
            ">




                <div>


                    <h1 className="
                    text-3xl
                    font-bold
                    mb-2
                    ">

                        Pandawa CMS

                    </h1>



                    <p className="
                    text-sm
                    text-slate-400
                    mb-10
                    ">

                        Graduation Management

                    </p>







                    <nav className="
                    space-y-3
                    ">


                    {
                        menus.map((item)=>(


                            <Link

                            key={item.path}

                            href={item.path}

                            className={`

                            block

                            px-5

                            py-3

                            rounded-xl


                            ${
                                pathname === item.path

                                ?

                                "bg-white/20 text-white"

                                :

                                "text-slate-400 hover:bg-white/10"

                            }

                            `}

                            >

                                {item.name}

                            </Link>


                        ))
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
                "

                >

                    Logout

                </button>







            </aside>









            <main className="
            flex-1
            p-8
            ">

                {children}

            </main>





        </div>


    );


}