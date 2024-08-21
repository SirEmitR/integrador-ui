import Image from "next/image";

export default function Home() {
  return (
    <main className="flex justify-center items-center gap-4 flex-col flex-1 p-4 bg-[#e8ebe5]">
      <img src="/asset.png" alt="Asset" className="w--full max-w-[280px]" />
      <p className="font-semibold">Emiliano Reyes message app</p>
      <p className="text-sm text-gray-500 flex justify-center items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-black">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
        Mensajes encriptados de extremo a extremo.</p>
    </main>
  );
}
