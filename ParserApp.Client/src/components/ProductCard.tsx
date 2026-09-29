import type { Product, ProductDraft } from '../types'

interface ProductCardProps {
  product: Product
  draft: ProductDraft
  isEditing: boolean
  isBusy: boolean
  isAnyProductBusy: boolean
  onDraftChange: (field: keyof ProductDraft, value: string) => void
  onStartEditing: () => void
  onCancelEditing: () => void
  onSave: () => void
  onDelete: () => void
}

function ProductCard({
  product,
  draft,
  isEditing,
  isBusy,
  isAnyProductBusy,
  onDraftChange,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#e0e1da] bg-white shadow-[0_2px_8px_rgba(28,38,29,0.035)]">
      {isEditing ? (
        <div className="flex h-48 items-center justify-center bg-[#f0f2ec] px-6 text-center text-sm text-[#879087]">
          Image preview updates after saving
        </div>
      ) : (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full bg-[#f0f2ec] object-cover"
          loading="lazy"
        />
      )}

      <div className="p-5">
        {isEditing ? (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#697269]">Product name</span>
              <input
                value={draft.name}
                onChange={(event) => onDraftChange('name', event.target.value)}
                className="w-full rounded-md border border-[#d6d9d1] px-3 py-2 text-sm outline-none focus:border-[#528061] focus:ring-2 focus:ring-[#528061]/15"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#697269]">Image URL</span>
              <input
                type="url"
                value={draft.imageUrl}
                onChange={(event) => onDraftChange('imageUrl', event.target.value)}
                className="w-full rounded-md border border-[#d6d9d1] px-3 py-2 text-sm outline-none focus:border-[#528061] focus:ring-2 focus:ring-[#528061]/15"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#697269]">Description</span>
              <textarea
                value={draft.description}
                onChange={(event) => onDraftChange('description', event.target.value)}
                rows={3}
                className="w-full resize-y rounded-md border border-[#d6d9d1] px-3 py-2 text-sm outline-none focus:border-[#528061] focus:ring-2 focus:ring-[#528061]/15"
              />
            </label>
          </div>
        ) : (
          <>
            <h3 className="text-base font-semibold text-[#262c27]">{product.name}</h3>
            <p className="mt-2 min-h-10 whitespace-pre-line text-sm leading-5 text-[#687168]">{product.description}</p>
          </>
        )}

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#eceee8] pt-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={onCancelEditing}
                disabled={isBusy}
                className="rounded-md border border-[#d8dbd4] px-3.5 py-2 text-sm font-medium text-[#535b53] transition hover:bg-[#f5f6f2] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isBusy || !draft.name.trim() || !draft.imageUrl.trim()}
                className="rounded-md bg-[#35764c] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#2b633f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBusy ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onDelete}
                disabled={isBusy}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[#a4473c] transition hover:bg-[#fbf0ed] disabled:opacity-50"
              >
                {isBusy ? 'Working…' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={onStartEditing}
                disabled={isAnyProductBusy}
                className="rounded-md border border-[#d8dbd4] px-3.5 py-2 text-sm font-semibold text-[#3d493f] transition hover:bg-[#f5f6f2] disabled:opacity-50"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
