import DateTime from '@/components/DateTime';
import MeetingTypeList from '@/components/MeetingTypeList';
import NextMeeting from '@/components/NextMeeting';


const Home = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <NextMeeting />
          <DateTime />
        </div>
      </div>

      <MeetingTypeList />
    </section>
  )
}

export default Home