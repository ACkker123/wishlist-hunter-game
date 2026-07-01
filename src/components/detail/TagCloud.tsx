interface TagCloudProps {
  tags: string[]
}

export function TagCloud({ tags }: TagCloudProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <span
          key={tag}
          className="px-3 py-1 text-[11px] rounded-full text-[#67c1f5] hover:text-[#87cef5] transition-colors cursor-default"
          style={{ background: 'rgba(103,193,245,0.08)' }}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
