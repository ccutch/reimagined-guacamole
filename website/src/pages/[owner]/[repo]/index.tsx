import { type NextPage } from "next"
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import IssueDetails from "../../../components/IssueDetails";
import IssuePreview from "../../../components/IssuePreview";
import Navbar from "../../../components/Navbar";
import { Issue } from "../../../types/issue";
import { trpc } from "../../../utils/trpc";

const Repository: NextPage = () => {
    const router = useRouter()
    const { owner, repo } = router.query as { owner?: string; repo?: string }
    
    const [query, setQuery] = useState("")    
    const [selectedIssue, selectIssue] = useState<null | string>(null)

    const { data: issues, refetch } = trpc.issues.getRepositoryIssues.useQuery(
        { owner, repo, query } as { owner: string; repo: string, query: string; },
        { enabled: owner != null && repo != null })

    return (
        <>
            <Head>
                <title>RidgeLine - {owner} / {repo} Issues</title>
                <meta name="description" content="RidgeLine - Github Issue Filter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen flex-col items-center">
                <Navbar title={`${owner} / ${repo}`} />

                <div className='container flex flex-col gap-12 px-4 py-12 h-full'>
                    <header className="flex items-center w-full">
                        <h2 className="text-3xl font-bold text-gray-500 mr-12 whitespace-nowrap">Latest Issues</h2>
                        <input type="text" placeholder="Search and filter issues" value={query} onChange={e => setQuery(e.target.value)}
                            className="font-semibold text-gray-600 max-w-[500px] w-full px-4 py-2 border-2 border-gray-300 rounded-full ml-auto" />
                    </header>
                    <div className="mb-4 grid grid-cols-5 gap-4 md:gap-8 w-auto mr-auto">
                        {issues && Object.entries(issues).map(([key, issue]) => (
                            <div key={key} onClick={() => selectIssue(key)} >
                                <IssuePreview {...issue} />
                            </div>
                        ))}
                    </div>
                </div>
                {selectedIssue && <IssueDetails issueKey={selectedIssue} close={() => selectIssue(null)} onRefresh={refetch} />} 
            </main>
        </>
    )
}

export default Repository