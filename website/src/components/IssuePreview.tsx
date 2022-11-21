
type IssuePreviewProps = {
  number: number,
  title: string,
  body: string,
}

const IssuePreview: React.FC<IssuePreviewProps> = ({ number, title, body }) => {
  return (
    <div className='w-[180px] h-[180px] p-4 rounded-md shadow-md bg-white select-none cursor-pointer'>
      <h5 className='text-gray-800 text-lg font-semibold min-h-[48px]'style={{
        'overflow': 'hidden',
        'textOverflow': 'ellipsis',
        'display': '-webkit-box',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical'
      }}>
        <span className='text-gray-400 mr-2'>#{number}</span>
        {title}
      </h5>
      <p className='text-gray-400 font-bold mt-5' style={{
        'overflow': 'hidden',
        'textOverflow': 'ellipsis',
        'display': '-webkit-box',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '-webkit-line-clamp': '3',
        '-webkit-box-orient': 'vertical'
      }}>{body}</p>
    </div>
  )
}

export default IssuePreview