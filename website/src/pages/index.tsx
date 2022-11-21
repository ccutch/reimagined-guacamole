import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import IssuePreview from "../components/IssuePreview";
import Navbar from "../components/Navbar";
import BackgroundImage from "../components/BackgroundImage";
import UserSummary from "../components/UserSummary";
import { useState } from "react";
import { Issue } from "../types/issue";
import IssueDetails from "../components/IssueDetails";


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
        <title>Create T3 App</title>
        <meta name="description" content="RidgeLine - Github Issue Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen flex-col items-center">
        <BackgroundImage />
        <Navbar clear />

        <div className='container flex justify-between gap-12 px-4 py-16 h-full'>
          <UserSummary />
          <div className="mb-4 grid grid-cols-5 gap-4 md:gap-8 w-auto mr-auto">
            {issues && Object.entries(issues as Map<string, Issue>).map(([key, issue]) => (
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