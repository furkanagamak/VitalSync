import * as React from "react";

function ProfileImage() {
  return (
    <div className="flex flex-col self-stretch my-auto text-sm font-medium text-neutral-600 max-md:mt-10">
      <img loading="lazy" alt="" src="/profilepic.png" className="w-full aspect-[0.93]" />
      <div className="justify-center self-center p-1 mt-3.5 rounded-lg border border-solid bg-zinc-300 border-neutral-600">
        Change Profile Image
      </div>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="flex flex-col mt-1.5 text-3xl text-black max-md:mt-10">
      <h2 className="text-4xl text-left text-red-800">Contact Information</h2>
      <p className="mt-6 text-left">
        <span className="text-red-800">Cell No</span>: (123)-456-7890
      </p>
      <p className="mt-3 text-left">
        <span className="text-red-800">Office No</span>: (123)-456-7890
      </p>
      <p className="mt-2.5 text-left">
        <span className="text-red-800">Email</span>: Smith.john@sbu.com
      </p>
      <p className="mt-2 text-left">
        <span className="text-red-800">Office</span>: West Wing/307B
      </p>
      <div className="flex gap-5 justify-between items-start mt-24 text-sm font-medium text-neutral-600 max-md:pr-5 max-md:mt-10">
        <button className="justify-center px-1.5 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600">
          Change Contact Info
        </button>
        <button className="justify-center px-2 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600">
          Reset Password
        </button>
      </div>
    </div>
  );
}


function ProfileDetails() {
  return (
    <div className="flex flex-col grow shrink-0 self-start basis-0 w-fit max-md:max-w-full">
      <div className="flex gap-1.5 max-md:flex-wrap">
        <div style={{ display: 'inline-flex' }}>
        <h1 className="text-5xl text-red-800 max-md:text-4xl text-left">John Smith</h1>
        </div>
        <div className="flex flex-col justify-end">
  <p className="text-3xl text-black text-left">MD</p>
</div>
      </div>
      <p className="mt-5 text-3xl text-left text-black max-md:max-w-full">Neurologist</p>
      <p className="mt-2 text-3xl text-left text-black max-md:max-w-full">Neurology Department</p>
      <div className="flex flex-col mt-1.5 max-md:max-w-full">
        <p className="text-3xl text-left text-black max-md:max-w-full">Head of the Neurology Department</p>
        <div className="self-start mt-32 max-md:mt-10">
          <button className="justify-start px-5 py-1 text-sm font-medium text-neutral-600 bg-zinc-300 border border-solid border-neutral-600 rounded-lg">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}


function ProfileSection() {
  return (
    
    <div className="flex flex-col ml-5 w-[76%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-6 max-md:max-w-full">
      <div className="px-8 py-7 max-md:px-5 max-md:max-w-full" style={{ backgroundColor: '#F5F5DC' }}>
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[56%] max-md:ml-0 max-md:w-full">
            <div className="flex grow gap-4 border-r border-black max-md:flex-wrap max-md:mt-10">
                <ProfileDetails />
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[44%] max-md:ml-0 max-md:w-full">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function ScheduleCalendar() {
  return (
    <div >
      <div className="flex items-center justify-center">
      <div className="text-3xl font-bold text-center" >Febuary 2024</div>
      <img
          loading="lazy"
          src="/dateicon.png"
          className="shrink-0 self-stretch w-8 aspect-[0.91]"
          alt="Relevant alt text describing the image"
        />
              <button className="justify-center px-1.5 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600">
          Change Schedule
        </button>
      </div>
      <img src="/Calandar.png" className="grow w-full aspect-[1.64] max-md:mt-10 max-md:max-w-full" alt="Schedule" />
      
    </div>
  );
}

function ScheduleImage() {
  return (
    <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex items-center justify-center"> <div className="text-3xl font-bold">March 2024</div>

      </div>
      <img src="/Calandar.png" className="grow w-full aspect-[1.64] max-md:mt-10 max-md:max-w-full" alt="Schedule" />
    </div>
  );
  }
  

function MyComponent() {
  return (
    <div className="flex flex-col items-center pt-20 pr-5 pb-8 pl-14 bg-white max-md:pl-5">
        <button className="justify-center self-end px-3 py-1 text-sm font-medium text-white bg-red-800 rounded-lg border border-solid border-neutral-600">
          Terminate Account
        </button>
      <div className="self-stretch mt-2 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[24%] max-md:ml-0 max-md:w-full">
            <ProfileImage />
          </div>
          <ProfileSection />
        </div>
      </div>
      <div className="mt-4 w-full max-w-[1286px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <ScheduleCalendar />
          </div>
          <ScheduleImage />
        </div>
      </div>
    </div>
  );
}

export default MyComponent;