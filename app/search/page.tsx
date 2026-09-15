"use client";

import {useRouter} from "next/navigation";
import Button from "@/components/Button";

export default function Search(){

const router=useRouter();

return (
<main className="min-h-screen flex items-center justify-center p-8">

<div className="glass rounded-3xl p-10 w-full max-w-md">

<h1 className="text-3xl font-bold text-center">
Find Your Photo
</h1>

<input className="mt-8 w-full p-4 rounded-xl bg-black/40 border border-white/20" placeholder="Graduation Number"/>

<select className="mt-4 w-full p-4 rounded-xl bg-black/40 border border-white/20">
<option>Faculty</option>
</select>

<select className="mt-4 w-full p-4 rounded-xl bg-black/40 border border-white/20">
<option>Study Program</option>
</select>

<div className="text-center">
<Button onClick={()=>router.push("/photo")}>
SEARCH PHOTO
</Button>
</div>

</div>

</main>
)
}