import type { SyntheticEvent } from 'react'

interface ProductSourceFormProps {
  productCount: number
  targetUrl: string
  isParsing: boolean
  error: string
  notice: string
  onTargetUrlChange: (value: string) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
}

function ProductSourceForm({
  productCount,
  targetUrl,
  isParsing,
  error,
  notice,
  onTargetUrlChange,
  onSubmit,
}: ProductSourceFormProps) {
  return (
    <section aria-labelledby="parse-heading" className="border-b border-[#dedfd7] pb-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-[#62806b]">Catalog tools</p>
          <h2 id="parse-heading" className="text-lg font-semibold">Import products from a website</h2>
        </div>
        <p className="text-sm text-[#788078]">{productCount} {productCount === 1 ? 'product' : 'products'}</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="source-url" className="sr-only">Target website URL</label>
        <input
          id="source-url"
          type="url"
          value={targetUrl}
          onChange={(event) => onTargetUrlChange(event.target.value)}
          placeholder="https://example.com/products"
          required
          className="min-w-0 flex-1 rounded-md border border-[#d6d9d1] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9ba19a] focus:border-[#528061] focus:ring-2 focus:ring-[#528061]/15"
        />
        <button
          type="submit"
          disabled={isParsing || !targetUrl.trim()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#285e3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#204d31] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isParsing && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {isParsing ? 'Parsing products…' : 'Parse Products'}
        </button>
      </form>
      {(error || notice) && (
        <p role={error ? 'alert' : 'status'} className={`mt-3 text-sm ${error ? 'text-[#ad3d32]' : 'text-[#35734a]'}`}>
          {error || notice}
        </p>
      )}
    </section>
  )
}

export default ProductSourceForm
