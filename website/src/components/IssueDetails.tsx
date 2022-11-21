import Link from 'next/link';
import { useMemo } from 'react';
import { FaCheck, FaClipboardList, FaEye, FaGithub, FaGlobe, FaList, FaRegWindowClose, FaUndo } from 'react-icons/fa'
import { DefaultSerializer } from 'v8';
import { trpc } from '../utils/trpc';

type IssueDetailsProps = {
    issueKey: string;
    close: (e: any) => void;
    onRefresh: () => void;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ issueKey: key, close, onRefresh }) => {
    const { data: details, refetch } = trpc.issues.getIssueDetails.useQuery(key)
    const { mutate: refresh } = trpc.issues.refreshRepository.useMutation()
    const { mutate: prioritize } = trpc.issues.togglePriority.useMutation()

    const [owner, repo, number] = useMemo(() => key.split(':') as [string, string, string], [key])
    const watching = useMemo(() => details?.prioritized, [details])

    return (
        <>
            <div className='z-40 fixed inset-0 cursor-pointer bg-black bg-opacity-20' onClick={close} />
            <div className='z-50 fixed right-0 bg-white shadow-2xl max-w-screen-sm w-full h-full py-12'>
                <header className='flex items-center px-8 font-bold text-xl text-gray-600'>
                    <FaRegWindowClose className='mr-3 text-2xl text-gray-500 cursor-pointer hover:text-gray-700' onClick={close} />
                    {repo} <span className='ml-2 text-gray-300'>#{number}</span>
                </header>

                <div className='flex flex-col mt-10 py-4 px-8 bg-gray-50'>
                    <div className='py-4 flex items-center text-md'>
                        <FaGlobe className='text-gray-500 mr-3' />
                        <a href={`https://github.com/${owner}/${repo}/issues/${number}`} target="blank"
                            className='text-blue-400 underline'>
                            https://github.com/{owner}/{repo}/issues/{number}
                        </a>
                    </div>
                    <div className='py-4 flex items-center text-md'>
                        <FaGithub className='text-gray-500 mr-3' />
                        <a href={`https://github.com/${owner}/${repo}`} target="blank"
                            className='text-blue-400 underline'>
                            https://github.com/{owner}/{repo}
                        </a>
                    </div>
                    <div className='py-4 flex items-center text-md'>
                        <FaClipboardList className='text-gray-500 mr-3' />
                        <Link href={`/${owner}/${repo}`}className='text-blue-400 underline'>
                            View Repository Issues
                        </Link>
                    </div>
                </div>

                <h2 className='px-8 font-semibold text-2xl text-gray-600 mt-10'>{details?.issue?.title}</h2>
                <div className='px-8 py-5 flex gap-4'>
                    <button onClick={e => prioritize(key, { onSuccess() { refetch();onRefresh(); } })}
                        className={`flex items-center px-4 py-1.5 rounded-md border-2 text-sm border-green-400 hover:bg-green-300 hover:text-white
                                    ${watching ? 'text-white' : 'text-green-400'} ${watching ? 'bg-green-400' : 'bg-white'} `}>
                        <FaEye className='mr-2' />
                        {!watching && 'Not '}Watching
                    </button>
                    <button onClick={e => refresh({ owner, repo }, { onSuccess() { refetch();onRefresh(); } })}
                        className="flex items-center px-4 py-1.5 rounded-md border-2 border-blue-400 bg-blue-400 hover:bg-blue-300 text-sm text-white">
                        <FaUndo className='mr-2' />
                        Refresh
                    </button>
                    <button onClick={e => refresh({ owner, repo }, { onSuccess() { refetch();onRefresh(); } })}
                        className="flex items-center px-4 py-1.5 rounded-md border-2 border-green-400 text-green-400 hover:bg-green-300 text-sm hover:text-white">
                        <FaCheck className='mr-2' />
                        Close Issue
                    </button>
                </div>
                <p className="px-8 mt-4 font-bold text-md text-gray-400 whitespace-pre">{details?.issue?.body}</p>
            </div>
        </>
    )
}

export default IssueDetails