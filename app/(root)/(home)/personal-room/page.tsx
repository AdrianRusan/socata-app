'use client'

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs"
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";


const Table = ({ title, description }: { title: string, description?: string }) => (
  <div className="flex flex-col items-start gap-2 xl:flex-row">
    <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">{title}</h1>
    <h2 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">{description}</h2>
  </div>
)

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id

  const { call } = useGetCallById(meetingId!);


  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call('default', meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Căsuța Noastră
      </h1>

      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table
          title='Ce-i asta?'
          description={`Camera de conferințe a lui ${user?.username}`}
        />
        <Table
          title='Id-ul camerei de conferințe'
          description={meetingId!}
        />
        <Table
          title='Link de invitație'
          description={meetingLink}
        />
      </div>

      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Intră în cameră
        </Button>
        <Button className="bg-dark-3" onClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({ title: "Link copiat", duration: 5000 })
        }}>
          Copiază invitația
        </Button>
      </div>
    </section>)
}

export default PersonalRoom