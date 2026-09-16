"use client";

import {
    useEffect,
    useState
} from "react";


type EventData = {

    id:number;

    name:string;

    title:string;

    date:string;

    thumbnail:string|null;

    type:string;

    slug:string;

    description:string|null;

    status:string;

};




export default function EventsPage(){


    const [events,setEvents] =
    useState<EventData[]>([]);


    const [thumbnail,setThumbnail] =
    useState<File|null>(null);


    const [preview,setPreview] =
    useState<string>("");


    const [loading,setLoading] =
    useState(false);


    const [message,setMessage] =
    useState("");




    const [form,setForm] =
    useState({

        name:"",

        slug:"",

        date:"",

        type:"PERSONAL",

        description:"",

        status:"active"

    });




    const token =
    typeof window !== "undefined"

    ?

    localStorage.getItem("token")

    :

    "";





    useEffect(()=>{

        loadEvents();

    },[]);






    const loadEvents = async()=>{


        try{


            const res =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events`,

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );



            const data =
            await res.json();



            setEvents(

                data.events || []

            );



        }catch(error){


            console.error(error);


        }


    };







    const slugify=(text:string)=>{


        return text

        .toLowerCase()

        .trim()

        .replace(/\s+/g,"-")

        .replace(/[^a-z0-9-]/g,"");


    };







    const changeName=(value:string)=>{


        setForm({

            ...form,

            name:value,

            slug:slugify(value)

        });


    };






    const updateField=(

        field:string,

        value:string

    )=>{


        setForm({

            ...form,

            [field]:value

        });


    };







    const handleThumbnail=(

        e:React.ChangeEvent<HTMLInputElement>

    )=>{


        const file =
        e.target.files?.[0];


        if(!file)
        return;



        setThumbnail(file);



        const url =
        URL.createObjectURL(file);



        setPreview(url);


    };






    const removeThumbnail=()=>{


        setThumbnail(null);

        setPreview("");


        const input =
        document.getElementById(
            "thumbnail"
        ) as HTMLInputElement;


        if(input){

            input.value="";

        }


    };







    const createEvent = async()=>{


        try{


            setLoading(true);

            setMessage("");



            const data =
            new FormData();



            data.append(
                "name",
                form.name
            );


            data.append(
                "slug",
                form.slug
            );


            data.append(
                "date",
                form.date
            );


            data.append(
                "type",
                form.type
            );


            data.append(
                "description",
                form.description
            );


            data.append(
                "status",
                form.status
            );



            if(thumbnail){

                data.append(
                    "thumbnail",
                    thumbnail
                );

            }






            const res =
            await fetch(

                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events`,

                {

                    method:"POST",

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    },

                    body:data

                }

            );




            const result =
            await res.json();




            if(!res.ok){


                setMessage(

                    result.message ||

                    "Create failed"

                );

                return;


            }




            setMessage(
                "Event created"
            );



            setForm({

                name:"",

                slug:"",

                date:"",

                type:"PERSONAL",

                description:"",

                status:"active"

            });



            removeThumbnail();



            loadEvents();




        }catch(error){


            console.error(error);


            setMessage(
                "Server error"
            );


        }finally{


            setLoading(false);


        }


    };

    const deleteEvent = async(id:number)=>{


    if(
        !confirm(
            "Delete event?"
        )
    ){

        return;

    }



    try{


        const res = await fetch(

            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/${id}`,

            {

                method:"DELETE",

                headers:{

                    Authorization:

                    `Bearer ${token}`

                }

            }

        );



        const result =
        await res.json();




        if(!res.ok){

            alert(
                result.message ||
                "Delete failed"
            );

            return;

        }




        setMessage(
            "Event deleted"
        );



        loadEvents();




    }catch(error){


        console.error(
            error
        );


        setMessage(
            "Server error"
        );


    }


};
    return(

        <div className="
        space-y-8
        ">


            <div>

                <h1 className="
                text-4xl
                font-bold
                ">

                    Event Management

                </h1>


                <p className="
                text-slate-400
                mt-2
                ">

                    Manage Personal and Gallery Events

                </p>

            </div>







            <div className="
            glass
            rounded-3xl
            p-8
            space-y-5
            ">


                <h2 className="
                text-2xl
                font-bold
                ">

                    Create Event

                </h2>






                <input

                placeholder="Event Name"

                value={form.name}

                onChange={(e)=>
                    changeName(
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

                />






                <input

                placeholder="Slug"

                value={form.slug}

                onChange={(e)=>
                    updateField(
                        "slug",
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

                />







                <input

                placeholder="Event Date"

                value={form.date}

                onChange={(e)=>
                    updateField(
                        "date",
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

                />







                <select

                value={form.type}

                onChange={(e)=>
                    updateField(
                        "type",
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

                    <option value="PERSONAL">
                        PERSONAL
                    </option>


                    <option value="GALLERY">
                        GALLERY
                    </option>


                </select>







                {/* THUMBNAIL UPLOAD */}

                <div className="
                space-y-3
                ">


                    <label

                    htmlFor="thumbnail"

                    className="
                    block
                    cursor-pointer
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/5
                    p-6
                    text-center
                    hover:bg-white/10
                    transition
                    "

                    >

                        {
                            preview

                            ?

                            "Replace Thumbnail"

                            :

                            "Choose Thumbnail"

                        }


                    </label>




                    <input

                    id="thumbnail"

                    type="file"

                    accept="image/*"

                    onChange={handleThumbnail}

                    className="hidden"

                    />





                    {
                        preview &&


                        <div className="
                        relative
                        rounded-2xl
                        overflow-hidden
                        border
                        border-white/20
                        ">


                            <img

                            src={preview}

                            className="
                            w-full
                            h-56
                            object-cover
                            "

                            />



                            <button

                            onClick={removeThumbnail}

                            className="
                            absolute
                            top-3
                            right-3
                            rounded-full
                            bg-red-500/80
                            px-4
                            py-2
                            "

                            >

                                Remove

                            </button>



                        </div>


                    }




                    {
                        thumbnail &&


                        <p className="
                        text-sm
                        text-slate-400
                        text-center
                        ">

                            Selected:
                            {" "}
                            {thumbnail.name}

                        </p>


                    }


                </div>








                <textarea

                placeholder="Description"

                value={form.description}

                onChange={(e)=>
                    updateField(
                        "description",
                        e.target.value
                    )
                }

                className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border
                min-h-32
                "

                />








                <select

                value={form.status}

                onChange={(e)=>
                    updateField(
                        "status",
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

                    <option value="active">
                        Active
                    </option>


                    <option value="inactive">
                        Inactive
                    </option>


                </select>








                <button

                onClick={createEvent}

                disabled={loading}

                className="
                px-8
                py-4
                rounded-full
                bg-blue-500/20
                border
                "

                >

                    {
                        loading

                        ?

                        "CREATING..."

                        :

                        "CREATE EVENT"

                    }

                </button>






                {
                    message &&

                    <p className="
                    text-center
                    text-sm
                    text-slate-300
                    ">

                        {message}

                    </p>

                }



            </div>









            <div className="
            glass
            rounded-3xl
            p-8
            ">


                <h2 className="
                text-2xl
                font-bold
                mb-6
                ">

                    Event List

                </h2>






                <div className="
                grid
                md:grid-cols-2
                gap-6
                ">


                {
                    events.map((event)=>(


                        <div

                        key={event.id}

                        className="
                        rounded-3xl
                        bg-black/20
                        border
                        p-6
                        "

                        >



                            {
                                event.thumbnail

                                ?

                                <img

                                src={
                                    `${process.env.NEXT_PUBLIC_API_URL}${event.thumbnail}`
                                }

                                className="
                                h-48
                                w-full
                                object-cover
                                rounded-xl
                                mb-5
                                "

                                />

                                :


                                <div

                                className="
                                h-48
                                rounded-xl
                                mb-5
                                bg-white/5
                                flex
                                items-center
                                justify-center
                                text-slate-400
                                "

                                >

                                    No Thumbnail

                                </div>


                            }







                            <h3 className="
                            text-xl
                            font-bold
                            ">

                                {event.name}

                            </h3>






                            <p className="mt-2">

                                Type:
                                {" "}
                                {event.type}

                            </p>





                            <p>

                                Date:
                                {" "}
                                {event.date}

                            </p>







                            <button

                            onClick={()=>
                                deleteEvent(
                                    event.id
                                )
                            }

                            className="
                            mt-5
                            px-5
                            py-3
                            rounded-full
                            bg-red-500/20
                            "

                            >

                                Delete

                            </button>





                        </div>


                    ))
                }



                </div>



            </div>






        </div>


    );


}