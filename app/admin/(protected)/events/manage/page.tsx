"use client";


import {
    useEffect,
    useState
} from "react";





export default function ManageEventPage(){


    const API =
    process.env.NEXT_PUBLIC_API_URL;




    const token =
    typeof window !== "undefined"

    ?

    localStorage.getItem("token")

    :

    "";





    const [events,setEvents] =
    useState<any[]>([]);



    const [eventId,setEventId] =
    useState("");



    const [event,setEvent] =
    useState<any>(null);




    const [thumbnail,setThumbnail] =
    useState<File|null>(null);




    const [galleryFiles,setGalleryFiles] =
    useState<File[]>([]);




    const [highlightTitle,setHighlightTitle] =
    useState("");




    const [highlightUrl,setHighlightUrl] =
    useState("");




    const [message,setMessage] =
    useState("");




    const [loading,setLoading] =
    useState(false);









    useEffect(()=>{

        loadEvents();

    },[]);









    const loadEvents = async()=>{


        const res =
        await fetch(

            `${API}/api/admin/events/options`,

            {

                headers:{

                    Authorization:

                    `Bearer ${token}`

                }

            }

        );



        const data =
        await res.json();



        setEvents(data);


    };









    const loadEvent = async(id:string)=>{


        const res =
        await fetch(

            `${API}/api/events/${id}`

        );



        const data =
        await res.json();



        setEvent(data);


    };









    const selectEvent=(id:string)=>{


        setEventId(id);

        setThumbnail(null);

        loadEvent(id);


    };









    const updateEvent = async()=>{


        try{


            setLoading(true);



            const form =
            new FormData();




            form.append(

                "name",

                event.name

            );



            form.append(

                "title",

                event.title

            );



            form.append(

                "date",

                event.date

            );



            form.append(

                "description",

                event.description || ""

            );







            if(thumbnail){


                form.append(

                    "thumbnail",

                    thumbnail

                );


            }









            const res =
            await fetch(

                `${API}/api/admin/events/${eventId}`,

                {

                    method:"PUT",

                    headers:{

                        Authorization:

                        `Bearer ${token}`

                    },

                    body:form

                }

            );






            const data =
            await res.json();





            if(res.ok){


                setMessage(

                    "Event updated"

                );


                loadEvent(eventId);



            }else{


                setMessage(

                    data.message

                );


            }




        }catch(error){


            console.error(error);


            setMessage(

                "Update failed"

            );


        }finally{


            setLoading(false);


        }


    };









    const uploadGallery = async()=>{


        const form =
        new FormData();




        form.append(

            "event_id",

            eventId

        );






        galleryFiles.forEach(file=>{


            form.append(

                "photos",

                file

            );


        });








        const res =
        await fetch(

            `${API}/api/admin/events/media/gallery`,

            {

                method:"POST",

                headers:{

                    Authorization:

                    `Bearer ${token}`

                },

                body:form

            }

        );






        if(res.ok){


            setMessage(

                "Gallery uploaded"

            );


            setGalleryFiles([]);


            loadEvent(eventId);


        }


    };









    const youtubeThumbnail=(url:string)=>{


        const match =
        url.match(

            /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/

        );



        if(!match)

        return null;



        return (

            `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`

        );


    };









    const addHighlight = async()=>{


        const res =
        await fetch(

            `${API}/api/admin/events/media/highlight`,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "application/json",


                    Authorization:

                    `Bearer ${token}`

                },


                body:JSON.stringify({

                    event_id:eventId,

                    title:highlightTitle,

                    url:highlightUrl

                })

            }

        );






        const data =
        await res.json();






        if(res.ok){


            setMessage(

                "Highlight added"

            );


            setHighlightTitle("");

            setHighlightUrl("");

            loadEvent(eventId);


        }else{


            setMessage(

                data.message

            );


        }


    };












return(


<main className="
space-y-8
">






<h1 className="
text-4xl
font-bold
">

Manage Event

</h1>









<div className="
glass
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
mb-5
">

Select Event

</h2>



<select

value={eventId}

onChange={(e)=>
selectEvent(
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


<option value="">

Choose Event

</option>



{

events.map(item=>(

<option

key={item.id}

value={item.id}

>

{item.name}

</option>


))

}


</select>



</div>









{

event &&

<>







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

Event Information

</h2>







<label className="
block
cursor-pointer
rounded-2xl
border
border-white/20
p-5
text-center
">


{

thumbnail ?

<img

src={
URL.createObjectURL(thumbnail)
}

className="
h-48
w-full
object-cover
rounded-xl
"

/>


:

event.thumbnail &&

<img

src={
`${API}${event.thumbnail}`
}

className="
h-48
w-full
object-cover
rounded-xl
"

/>


}





<p className="
mt-3
">

Change Event Thumbnail

</p>



<input

type="file"

accept="image/*"

hidden

onChange={(e)=>{


if(e.target.files){


setThumbnail(

e.target.files[0]

);


}



}}


/>


</label>








<input

value={event.name || ""}

onChange={(e)=>

setEvent({

...event,

name:e.target.value

})

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

value={event.title || ""}

onChange={(e)=>

setEvent({

...event,

title:e.target.value

})

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

value={event.date || ""}

onChange={(e)=>

setEvent({

...event,

date:e.target.value

})

}

className="
w-full
p-4
rounded-xl
bg-black/30
border
"

/>








<textarea

value={event.description || ""}

onChange={(e)=>

setEvent({

...event,

description:e.target.value

})

}

className="
w-full
p-4
rounded-xl
bg-black/30
border
"

 />









<button

onClick={updateEvent}

className="
px-8
py-3
rounded-full
bg-blue-500/20
border
"

>

{

loading

?

"Saving..."

:

"Save Event"

}

</button>


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

📸 Gallery Upload

</h2>






<label className="
block
rounded-2xl
border
border-white/20
p-8
text-center
cursor-pointer
">


📷

<br/>

Choose Photos



<input

type="file"

multiple

hidden

accept="image/*"

onChange={(e)=>{


if(e.target.files){

setGalleryFiles(

Array.from(
e.target.files
)

);

}



}}


/>


</label>








{

galleryFiles.length > 0 &&

<div className="
grid
grid-cols-4
gap-3
">


{

galleryFiles.map((file,index)=>(


<img

key={index}

src={
URL.createObjectURL(file)
}

className="
h-24
w-full
object-cover
rounded-xl
"

/>


))


}


</div>


}








<button

onClick={uploadGallery}

className="
px-6
py-3
rounded-full
bg-blue-500/20
border
"

>

Upload Gallery

</button>


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

🎥 Youtube Highlight

</h2>






<input

placeholder="Title"

value={highlightTitle}

onChange={(e)=>

setHighlightTitle(
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

placeholder="Youtube URL"

value={highlightUrl}

onChange={(e)=>

setHighlightUrl(
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







{

youtubeThumbnail(highlightUrl) &&

<img

src={
youtubeThumbnail(highlightUrl)!
}

className="
w-64
rounded-xl
"

/>


}







<button

onClick={addHighlight}

className="
px-6
py-3
rounded-full
bg-purple-500/20
border
"

>

Add Highlight

</button>



</div>









<div className="
glass
rounded-3xl
p-8
">


<h2 className="
text-2xl
font-bold
mb-5
">

Existing Media

</h2>





<div className="
grid
md:grid-cols-4
gap-5
">


{

event.media?.map((item:any)=>(


<div

key={item.id}

className="
border
rounded-xl
overflow-hidden
"

>


{

item.type==="gallery"

?

<img

src={`${API}${item.url}`}

className="
h-32
w-full
object-cover
"

/>

:

<img

src={
youtubeThumbnail(item.url)
|| ""
}

className="
h-32
w-full
object-cover
"

/>


}


<p className="
p-3
text-sm
">

{item.title}

</p>


</div>


))


}



</div>


</div>





</>


}







{

message &&

<div className="
text-center
text-blue-300
">

{message}

</div>

}




</main>


);


}