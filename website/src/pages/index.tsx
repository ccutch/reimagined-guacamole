import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import IssuePreview from "../components/IssuePreview";
import Navbar from "../components/Navbar";
import BackgroundImage from "../components/BackgroundImage";
import UserSummary from "../components/UserSummary";
import { useEffect, useState } from "react";
import { Issue } from "../types/issue";
import IssueDetails from "../components/IssueDetails";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";


const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: issues, refetch } = trpc.issues.getPrioritizedIssues.useQuery(
    void 0,
    { enabled: sessionData?.user !== undefined },
  )

  const [selectedIssue, setSelectedIssue] = useState<null | string>(null)
  const selectIssue = (key: string) => setSelectedIssue(key)


  return (
    <>
      <Head>
        <title>RidgeLine - Github Issue Filter</title>
        <meta name="description" content="RidgeLine - Github Issue Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen flex-col items-center">
        <BackgroundImage />
        <Navbar clear />

        {!sessionData && (
          <SigninPanel />
        )}

        <div className='container flex justify-between gap-12 px-4 py-16 h-full'>
          <UserSummary />
          <div className="mb-4 grid grid-cols-5 gap-4 md:gap-8 w-auto mr-auto">
            {issues && Object.entries(issues as {[key: string]: Issue}).map(([key, issue]) => (
              <div key={key} onClick={() => selectIssue(key)}>
                <IssuePreview  {...issue} />
              </div>
            ))}
          </div>
        </div>
        {selectedIssue && <IssueDetails issueKey={selectedIssue} close={() => setSelectedIssue(null)} onRefresh={refetch} />}
      </main>
    </>
  );
};

export default Home;



const SigninPanel: React.FC = () => {
  return (
    <div className='flex flex-col items-center p-12 rounded-lg bg-white bg-opacity-90 mt-10'>
      <h1 className="font-bold text-gray-300 text-5xl mb-4">Please Login</h1>
      <h4 className="font-semibold text-gray-300 text-xl">Login with Discord to get started.</h4>

      <button onClick={() => signIn('discord')} className="mt-12 px-10 py-4 flex items-center block bg-[#7289da] text-white rounded-lg text-lg hover:brightness-110">
        <FaDiscord className='mr-3 text-2xl' />
        Login with Discord
      </button>
    </div>
  )
}