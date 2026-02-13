const SectionTitle = ({ index, title }: { index: number; title: string }) => {
  return (
    <div className='mb-6'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-secondary-200 flex items-center justify-center rounded-[5px] text-secondary-700 font-bold text-4xl pt-[6px]'>
          {index}
        </div>
        <h2 className='text-3xl font-bold text-neutral-800'>{title}</h2>
        <hr className='w-full h-[1px] bg-neutral-300 flex-1' />
      </div>
    </div>
  )
}

export default SectionTitle
