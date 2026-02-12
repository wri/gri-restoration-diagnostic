'use client'

interface RationaleEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

// Static mockup until editor selection is finalized
export function RationaleEditor({ 
  value, 
  onChange, 
  placeholder = "Add your rationale...",
  minHeight = "200px"
}: RationaleEditorProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50">
        <button className="flex items-center gap-1 text-xs text-slate-600 pr-2 border-r border-slate-200">
          Normal text 
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
        <button className="p-1 hover:bg-slate-200 rounded">
          <span className="material-symbols-outlined text-base">format_list_bulleted</span>
        </button>
        <button className="p-1 hover:bg-slate-200 rounded">
          <span className="material-symbols-outlined text-base">text_format</span>
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <button className="p-1 hover:bg-slate-200 rounded font-serif font-bold">B</button>
        <button className="p-1 hover:bg-slate-200 rounded italic">I</button>
        <button className="p-1 hover:bg-slate-200 rounded underline">U</button>
        <button className="p-1 hover:bg-slate-200 rounded line-through">S</button>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <button className="p-1 hover:bg-slate-200 rounded">
          <span className="material-symbols-outlined text-base">format_align_left</span>
        </button>
        <button className="p-1 hover:bg-slate-200 rounded">
          <span className="material-symbols-outlined text-base">link</span>
        </button>
      </div>
      
      {/* Content Area */}
      <div className="p-6" style={{ minHeight }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-[150px] resize-none border-0 focus:ring-0 text-slate-600 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  )
}
