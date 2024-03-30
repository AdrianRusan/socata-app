'use client'

import React, { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "./ui/use-toast"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from "react-datepicker"
import { Input } from "./ui/input"

const MeetingTypeList = () => {
  const router = useRouter()

  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setCallDetails] = useState<Call>()

  const { toast } = useToast();
  const { user } = useUser();
  const client = useStreamVideoClient();


  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: 'Eroare',
          description: 'Vă rugăm să selectați o dată și oră pentru ședință',
          duration: 5000
        })
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create call');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Conferință instantanee';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          }
        },
      })

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({ title: 'Succes', description: 'Ședința a fost creată cu succes', duration: 5000 })

    } catch (err) {
      console.error(err)
      toast({
        title: 'Eroare',
        description: 'Nu am putut crea ședința',
        duration: 5000
      })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="Ședință Nouă"
        description="Începe o nouă conferință"
        handleClick={() => setMeetingState('isInstantMeeting')}
        className="bg-orange-1"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Programează"
        description="Programează o conferință"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className="bg-blue-1"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="Înregistrări"
        description="Urmărește înregistrările"
        handleClick={() => router.push('/recordings')}
        className="bg-purple-1"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Alătură-te Ședinței"
        description="Printr-un link de invitație"
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className="bg-yellow-1"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Programează o Ședință"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Adaugă o descriere
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Alege o dată și oră
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Timp"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Ședință Creată"
          buttonText="Copiază Link-ul de Invitație"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({ title: "Link copiat", duration: 5000 })
          }}
          image='/icons/checked.svg'
          buttonIcon="/icons/copy.svg"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Începe o Ședință Instantanee"
        buttonText="Începe Ședința"
        className="text-center"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Scrie link-ul de invitație"
        buttonText="Alătură-te Ședinței"
        className="text-center"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Link de invitație"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>

    </section>
  )
}

export default MeetingTypeList