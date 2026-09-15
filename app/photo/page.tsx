import Button from "@/components/Button";

export default function Photo(){

return (
<main className="min-h-screen flex items-center justify-center p-8">

<div className="glass rounded-3xl p-10 max-w-2xl w-full text-center">

<h1 className="text-4xl font-bold">
Your Photos
</h1>

<div className="grid grid-cols-3 gap-4 mt-10">

{[1,2,3].map(i=>
<div
key={i}
className="
h-52 rounded-2xl
bg-gradient-to-br from-slate-900 to-blue-600
flex items-center justify-center
text-5xl
"
>
📸
</div>
)}

</div>

<div className="mt-8 text-slate-300 leading-8">
Ahmad Fauzan<br/>
Graduation Number: WIS-2026-001<br/>
Faculty: Computer Science<br/>
Program: Information Technology
</div>

<Button>
DOWNLOAD ALL PHOTOS
</Button>

<p className="mt-6 text-sm">
Wrong photo?
<a className="text-cyan-400 ml-2" href="mailto:graduation@university.ac.id">
Report
</a>
</p>

</div>

</main>
)
}